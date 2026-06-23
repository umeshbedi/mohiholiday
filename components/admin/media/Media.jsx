'use client'
import React, { useEffect, useState } from 'react'
import ImageUpload from './ImageUpload'
import { Image, message } from 'antd'
import { db } from '@/firebase'
import { updateCloudinaryWidth } from './urlUpdate'

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy') ? resolve() : reject();
    } catch {
      reject();
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

export default function Media() {
  const [media, setMedia] = useState([])
  const [msg, showMsg] = message.useMessage()
  const [copiedId, setCopiedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const PAGE_SIZE = 20
  const mediadb = db.collection('media')

  async function deleteImage({ id, deletehash }) {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setDeletingId(id)
    const res = await fetch('/api/deleteImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: deletehash }),
    });

    await res.json().then((data) => {
      if (data.error) {
        msg.error(data.error);
      } else {
        msg.success('Image deleted successfully');
        mediadb.doc(id).delete().catch((error) => {
          console.error('Error deleting image document:', error);
          msg.error('Failed to delete image document');
        });
      }
    }).catch((error) => {
      console.error('Error deleting image:', error);
      msg.error('Failed to delete image');
    }).finally(() => setDeletingId(null));
  }

  useEffect(() => {
    const unsubscribe = mediadb
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .onSnapshot((snap) => {
        const tempMedia = []
        snap.forEach((sndata) => {
          tempMedia.push({ id: sndata.id, ...sndata.data() })
        })
        setMedia(tempMedia)
        setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
        setHasMore(snap.docs.length === PAGE_SIZE)
      })
    return () => unsubscribe()
  }, [])

  async function loadMore() {
    if (!lastDoc || loadingMore) return
    setLoadingMore(true)
    try {
      const snap = await mediadb
        .orderBy('createdAt', 'desc')
        .startAfter(lastDoc)
        .limit(PAGE_SIZE)
        .get()
      const more = []
      snap.forEach((sndata) => {
        more.push({ id: sndata.id, ...sndata.data() })
      })
      setMedia(prev => [...prev, ...more])
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null)
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (e) {
      msg.error('Failed to load more images')
    } finally {
      setLoadingMore(false)
    }
  }

  function handleCopy(image) {
    copyToClipboard(image.link)
      .then(() => {
        setCopiedId(image.id)
        msg.success("Link copied!")
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch(() => msg.error("Failed to copy"));
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)', padding: '32px 24px' }}>
      {showMsg}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #15aee8, #0e82b0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(21,174,232,0.35)'
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Media Library</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 400, textAlign: 'left' }}>
              {media.length} image{media.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Upload Card */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '28px 28px',
        marginBottom: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(21,174,232,0.08)',
        border: '1px solid rgba(21,174,232,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #15aee8, #0e82b0)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#334155' }}>Upload New Image</span>
        </div>
        <ImageUpload to={'Photos'} />
      </div>

      {/* Gallery Grid */}
      {media.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '2px dashed #e2e8f0'
        }}>
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth={1.2} style={{ marginBottom: 16 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: 0 }}>No images yet. Upload your first one above!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16
        }}>
          {media.map((image) => {
            const newUrl = updateCloudinaryWidth(image.link, 300);
            const isDeleting = deletingId === image.id;
            const isCopied = copiedId === image.id;
            return (
              <div
                key={image.id}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  border: '1px solid #f1f5f9',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,174,232,0.18)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                }}
              >
                {/* Image Preview */}
                <div style={{ position: 'relative', height: 150, background: '#f8fafc', overflow: 'hidden' }}>
                  <Image
                    src={newUrl}
                    alt="media"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    placeholder={
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #15aee8', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    }
                  />

                  {/* Delete button overlay */}
                  <button
                    onClick={() => deleteImage({ id: image.id, deletehash: image.deletehash })}
                    disabled={isDeleting}
                    title="Delete image"
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'background 0.2s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Copy Link Button */}
                <button
                  onClick={() => handleCopy(image)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: 'none', cursor: 'pointer',
                    background: isCopied
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #15aee8, #0e82b0)',
                    color: 'white',
                    fontSize: '0.78rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  {isCopied ? (
                    <>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: '12px 36px',
              borderRadius: 50,
              border: '2px solid #15aee8',
              background: loadingMore ? 'rgba(21,174,232,0.08)' : 'white',
              color: '#15aee8',
              fontSize: '0.88rem', fontWeight: 700,
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
              boxShadow: '0 2px 12px rgba(21,174,232,0.15)',
            }}
            onMouseEnter={e => { if (!loadingMore) { e.currentTarget.style.background = '#15aee8'; e.currentTarget.style.color = 'white'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#15aee8'; }}
          >
            {loadingMore ? (
              <>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #15aee8', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                Loading...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Load More
              </>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
