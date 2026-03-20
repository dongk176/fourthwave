"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ResultType = "audio" | "video";

interface ResultItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  type: ResultType;
  mediaUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

interface FaqAdminItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

type StatusKind = "idle" | "success" | "error";

interface EditDraft {
  id: string;
  title: string;
  artist: string;
  description: string;
}

interface FaqEditDraft {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

async function createVideoThumbnailFromFile(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    let finished = false;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute("src");
      video.load();
    };

    const finish = (result: File | null) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve(result);
    };

    const capture = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        finish(null);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        finish(null);
        return;
      }

      context.drawImage(video, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            finish(null);
            return;
          }
          finish(new File([blob], "auto-thumbnail.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    };

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.onerror = () => finish(null);
    video.onloadeddata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const target = duration > 0 ? Math.min(0.2, Math.max(duration * 0.03, 0.06)) : 0.1;
      try {
        video.currentTime = target;
      } catch {
        capture();
      }
    };
    video.onseeked = capture;
    video.src = objectUrl;
    video.load();
  });
}

export default function AdminConsole() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<ResultType>("audio");
  const [items, setItems] = useState<ResultItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqAdminItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isLoadingFaqItems, setIsLoadingFaqItems] = useState(true);
  const [statusKind, setStatusKind] = useState<StatusKind>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [faqStatusKind, setFaqStatusKind] = useState<StatusKind>("idle");
  const [faqStatusMessage, setFaqStatusMessage] = useState("");
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [faqEditDraft, setFaqEditDraft] = useState<FaqEditDraft | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingFaqId, setSavingFaqId] = useState<string | null>(null);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  async function loadItems() {
    try {
      setIsLoadingItems(true);
      const response = await fetch("/api/results", { cache: "no-store" });
      const payload = (await response.json()) as { items?: ResultItem[] };
      setItems(payload.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  }

  async function loadFaqItems() {
    try {
      setIsLoadingFaqItems(true);
      const response = await fetch("/api/faq", { cache: "no-store" });
      const payload = (await response.json()) as { items?: FaqAdminItem[] };
      setFaqItems(payload.items ?? []);
    } catch {
      setFaqItems([]);
    } finally {
      setIsLoadingFaqItems(false);
    }
  }

  useEffect(() => {
    void Promise.all([loadItems(), loadFaqItems()]);
  }, []);

  const totalText = useMemo(() => `${items.length} uploaded`, [items.length]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatusKind("idle");
    setStatusMessage("");

    try {
      const selectedType = (formData.get("type")?.toString() || "audio") as ResultType;
      const mediaFile = formData.get("mediaFile");
      const thumbnailFile = formData.get("thumbnailFile");
      const hasThumbnail = thumbnailFile instanceof File && thumbnailFile.size > 0;

      if (
        selectedType === "video" &&
        mediaFile instanceof File &&
        mediaFile.size > 0 &&
        !hasThumbnail
      ) {
        const autoThumbnail = await createVideoThumbnailFromFile(mediaFile);
        if (autoThumbnail) {
          formData.set("thumbnailFile", autoThumbnail);
        }
      }

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setStatusKind("error");
        setStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        setStatusKind("error");
        setStatusMessage(payload.message || "Upload failed.");
        return;
      }

      setStatusKind("success");
      setStatusMessage("Upload complete. Works page has been updated.");
      form.reset();
      setUploadType("audio");
      await loadItems();
    } catch {
      setStatusKind("error");
      setStatusMessage("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(item: ResultItem) {
    setEditDraft({
      id: item.id,
      title: item.title,
      artist: item.artist,
      description: item.description,
    });
    setStatusKind("idle");
    setStatusMessage("");
  }

  function cancelEdit() {
    setEditDraft(null);
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editDraft) return;

    const title = editDraft.title.trim();
    const artist = editDraft.artist.trim();
    const description = editDraft.description.trim();

    if (!title) {
      setStatusKind("error");
      setStatusMessage("Title is required.");
      return;
    }

    setSavingId(editDraft.id);
    setStatusKind("idle");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/admin/results/${editDraft.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          artist,
          description,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setStatusKind("error");
        setStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        setStatusKind("error");
        setStatusMessage(payload.message || "Update failed.");
        return;
      }

      setStatusKind("success");
      setStatusMessage("Result updated.");
      setEditDraft(null);
      await loadItems();
    } catch {
      setStatusKind("error");
      setStatusMessage("Update failed. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(item: ResultItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    setStatusKind("idle");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/admin/results/${item.id}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setStatusKind("error");
        setStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        setStatusKind("error");
        setStatusMessage(payload.message || "Delete failed.");
        return;
      }

      setStatusKind("success");
      setStatusMessage("Result deleted.");
      if (editDraft?.id === item.id) {
        setEditDraft(null);
      }
      await loadItems();
    } catch {
      setStatusKind("error");
      setStatusMessage("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function startFaqEdit(item: FaqAdminItem) {
    setFaqEditDraft({
      id: item.id,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
    });
    setFaqStatusKind("idle");
    setFaqStatusMessage("");
  }

  function cancelFaqEdit() {
    setFaqEditDraft(null);
  }

  async function handleFaqCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const question = (formData.get("question")?.toString() || "").trim();
    const answer = (formData.get("answer")?.toString() || "").trim();
    const sortOrderRaw = (formData.get("sortOrder")?.toString() || "").trim();
    const parsedSortOrder = Number.parseInt(sortOrderRaw, 10);
    const sortOrder = Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0;

    if (!question) {
      setFaqStatusKind("error");
      setFaqStatusMessage("Question is required.");
      return;
    }
    if (!answer) {
      setFaqStatusKind("error");
      setFaqStatusMessage("Answer is required.");
      return;
    }

    setIsSubmittingFaq(true);
    setFaqStatusKind("idle");
    setFaqStatusMessage("");
    try {
      const response = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          sortOrder,
        }),
      });
      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setFaqStatusKind("error");
        setFaqStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        setFaqStatusKind("error");
        setFaqStatusMessage(payload.message || "Failed to create FAQ.");
        return;
      }

      setFaqStatusKind("success");
      setFaqStatusMessage("FAQ item created.");
      form.reset();
      await loadFaqItems();
    } catch {
      setFaqStatusKind("error");
      setFaqStatusMessage("Failed to create FAQ. Please try again.");
    } finally {
      setIsSubmittingFaq(false);
    }
  }

  async function submitFaqEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!faqEditDraft) return;

    const question = faqEditDraft.question.trim();
    const answer = faqEditDraft.answer.trim();
    const sortOrder = Number.isFinite(faqEditDraft.sortOrder)
      ? faqEditDraft.sortOrder
      : 0;

    if (!question) {
      setFaqStatusKind("error");
      setFaqStatusMessage("Question is required.");
      return;
    }
    if (!answer) {
      setFaqStatusKind("error");
      setFaqStatusMessage("Answer is required.");
      return;
    }

    setSavingFaqId(faqEditDraft.id);
    setFaqStatusKind("idle");
    setFaqStatusMessage("");

    try {
      const response = await fetch(`/api/admin/faq/${faqEditDraft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          sortOrder,
        }),
      });
      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setFaqStatusKind("error");
        setFaqStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        setFaqStatusKind("error");
        setFaqStatusMessage(payload.message || "Failed to update FAQ.");
        return;
      }

      setFaqStatusKind("success");
      setFaqStatusMessage("FAQ item updated.");
      setFaqEditDraft(null);
      await loadFaqItems();
    } catch {
      setFaqStatusKind("error");
      setFaqStatusMessage("Failed to update FAQ. Please try again.");
    } finally {
      setSavingFaqId(null);
    }
  }

  async function handleFaqDelete(item: FaqAdminItem) {
    const confirmed = window.confirm(
      `Delete FAQ question "${item.question}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingFaqId(item.id);
    setFaqStatusKind("idle");
    setFaqStatusMessage("");

    try {
      const response = await fetch(`/api/admin/faq/${item.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { message?: string };

      if (response.status === 401) {
        setFaqStatusKind("error");
        setFaqStatusMessage("Session expired. Please login again.");
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        setFaqStatusKind("error");
        setFaqStatusMessage(payload.message || "Failed to delete FAQ.");
        return;
      }

      setFaqStatusKind("success");
      setFaqStatusMessage("FAQ item deleted.");
      if (faqEditDraft?.id === item.id) {
        setFaqEditDraft(null);
      }
      await loadFaqItems();
    } catch {
      setFaqStatusKind("error");
      setFaqStatusMessage("Failed to delete FAQ. Please try again.");
    } finally {
      setDeletingFaqId(null);
    }
  }

  return (
    <main className="min-h-screen px-6 md:px-12 py-16">
      <section className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase leading-none">
              ADMIN PAGE
            </h1>
            <p className="text-slate-300 mt-5 max-w-2xl text-lg">
              Manage overall updates across the site.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-primary/25 bg-primary/10 px-5 py-3 text-sm uppercase tracking-widest text-primary font-bold">
              {totalText}
            </div>
            <a
              href="/admin/inquiries"
              className="border border-primary/30 bg-transparent px-5 py-3 text-sm uppercase tracking-widest text-slate-200 font-bold hover:border-primary hover:text-primary transition-colors"
            >
              Inquiries
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-primary/30 bg-transparent px-5 py-3 text-sm uppercase tracking-widest text-slate-200 font-bold hover:border-primary hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-8">
          <div className="border border-primary/20 bg-background-elevated p-8 md:p-10">
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                    Type
                  </label>
                  <select
                    className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base focus:outline-none focus:border-primary"
                    name="type"
                    value={uploadType}
                    onChange={(event) =>
                      setUploadType(event.target.value as ResultType)
                    }
                  >
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                    Artist
                  </label>
                  <input
                    className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    name="artist"
                    placeholder="FourthWave Artist"
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Title
                </label>
                <input
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  name="title"
                  placeholder="Result Title"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  name="description"
                  placeholder="Short context about this work"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  {uploadType === "video" ? "Video File" : "Audio File"}
                </label>
                <input
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base file:mr-4 file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-primary file:font-bold file:uppercase file:text-xs file:tracking-wider"
                  name="mediaFile"
                  required
                  type="file"
                  accept={uploadType === "video" ? "video/*" : "audio/*"}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Thumbnail (Optional)
                </label>
                <input
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base file:mr-4 file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-primary file:font-bold file:uppercase file:text-xs file:tracking-wider"
                  name="thumbnailFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d8c08f] text-[#1f2328] text-base px-8 py-4 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Uploading..." : "Upload Result"}
              </button>

              {statusMessage ? (
                <p
                  className={`text-sm ${
                    statusKind === "error" ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {statusMessage}
                </p>
              ) : null}
            </form>
          </div>

          <aside className="border border-primary/20 bg-background-elevated p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">
              Latest Uploads
            </h2>
            {isLoadingItems ? (
              <p className="text-slate-400">Loading uploads...</p>
            ) : items.length === 0 ? (
              <p className="text-slate-400">
                No uploaded results yet. Add the first one from the form.
              </p>
            ) : (
              <div className="space-y-5 max-h-[850px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="border border-primary/15 bg-primary/5 p-5"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-primary font-bold">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">
                      {item.artist} • {formatDate(item.createdAt)}
                    </p>
                    {editDraft?.id === item.id ? (
                      <form className="space-y-4" onSubmit={submitEdit}>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Title
                          </label>
                          <input
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={editDraft.title}
                            onChange={(event) =>
                              setEditDraft((prev) =>
                                prev
                                  ? { ...prev, title: event.target.value }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Artist
                          </label>
                          <input
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={editDraft.artist}
                            onChange={(event) =>
                              setEditDraft((prev) =>
                                prev
                                  ? { ...prev, artist: event.target.value }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            rows={3}
                            value={editDraft.description}
                            onChange={(event) =>
                              setEditDraft((prev) =>
                                prev
                                  ? { ...prev, description: event.target.value }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={savingId === item.id}
                            className="bg-[#d8c08f] text-[#1f2328] px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-[#ead8b0] transition-colors disabled:opacity-60"
                          >
                            {savingId === item.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={savingId === item.id}
                            className="border border-primary/30 px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-200 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        {item.type === "video" ? (
                          <video
                            className="w-full aspect-video bg-black"
                            controls
                            preload="metadata"
                            poster={item.thumbnailUrl}
                            src={item.mediaUrl}
                          />
                        ) : (
                          <div className="space-y-3">
                            {item.thumbnailUrl ? (
                              <img
                                alt={`${item.title} cover`}
                                className="w-full aspect-video object-cover"
                                src={item.thumbnailUrl}
                              />
                            ) : null}
                            <audio className="w-full" controls src={item.mediaUrl} />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            disabled={deletingId === item.id}
                            className="border border-primary/30 px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-200 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="border border-red-400/40 px-4 py-2 text-xs uppercase tracking-wider font-bold text-red-200 hover:border-red-300 hover:text-red-100 transition-colors disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>

        <div className="mt-14 grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-8">
          <div className="border border-primary/20 bg-background-elevated p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">
              FAQ Manager
            </h2>
            <form className="space-y-6" onSubmit={handleFaqCreate}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Question
                </label>
                <input
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  name="question"
                  placeholder="Enter question"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Answer
                </label>
                <textarea
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  name="answer"
                  placeholder="Enter answer"
                  rows={5}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  Sort Order
                </label>
                <input
                  className="w-full bg-transparent border border-primary/30 px-4 py-3 text-base placeholder:text-slate-500 focus:outline-none focus:border-primary"
                  name="sortOrder"
                  placeholder="0"
                  type="number"
                  min={0}
                  defaultValue={0}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingFaq}
                className="w-full bg-[#d8c08f] text-[#1f2328] text-base px-8 py-4 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingFaq ? "Saving..." : "Add FAQ"}
              </button>
              {faqStatusMessage ? (
                <p
                  className={`text-sm ${
                    faqStatusKind === "error" ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {faqStatusMessage}
                </p>
              ) : null}
            </form>
          </div>

          <aside className="border border-primary/20 bg-background-elevated p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">
              Current FAQ
            </h2>
            {isLoadingFaqItems ? (
              <p className="text-slate-400">Loading FAQ items...</p>
            ) : faqItems.length === 0 ? (
              <p className="text-slate-400">
                No FAQ items yet. Add the first one from the form.
              </p>
            ) : (
              <div className="space-y-4 max-h-[850px] overflow-y-auto pr-1">
                {faqItems.map((item) => (
                  <article
                    key={item.id}
                    className="border border-primary/15 bg-primary/5 p-5"
                  >
                    {faqEditDraft?.id === item.id ? (
                      <form className="space-y-4" onSubmit={submitFaqEdit}>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Question
                          </label>
                          <input
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={faqEditDraft.question}
                            onChange={(event) =>
                              setFaqEditDraft((prev) =>
                                prev
                                  ? { ...prev, question: event.target.value }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Answer
                          </label>
                          <textarea
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            rows={4}
                            value={faqEditDraft.answer}
                            onChange={(event) =>
                              setFaqEditDraft((prev) =>
                                prev
                                  ? { ...prev, answer: event.target.value }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                            Sort Order
                          </label>
                          <input
                            className="w-full bg-transparent border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            type="number"
                            min={0}
                            value={faqEditDraft.sortOrder}
                            onChange={(event) =>
                              setFaqEditDraft((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      sortOrder: Number.parseInt(event.target.value, 10) || 0,
                                    }
                                  : prev,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={savingFaqId === item.id}
                            className="bg-[#d8c08f] text-[#1f2328] px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-[#ead8b0] transition-colors disabled:opacity-60"
                          >
                            {savingFaqId === item.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelFaqEdit}
                            disabled={savingFaqId === item.id}
                            className="border border-primary/30 px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-200 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold">{item.question}</h3>
                          <span className="text-[10px] uppercase tracking-[0.24em] text-primary font-bold border border-primary/30 px-2 py-1">
                            {item.sortOrder}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {item.answer}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startFaqEdit(item)}
                            disabled={deletingFaqId === item.id}
                            className="border border-primary/30 px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-200 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFaqDelete(item)}
                            disabled={deletingFaqId === item.id}
                            className="border border-red-400/40 px-4 py-2 text-xs uppercase tracking-wider font-bold text-red-200 hover:border-red-300 hover:text-red-100 transition-colors disabled:opacity-60"
                          >
                            {deletingFaqId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
