import { useState, useEffect, useCallback } from 'react';
import { Loader2, ChevronDown, ChevronRight, Trash2, EyeOff, Eye, MessageSquare } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function CommunityModeration() {
  const { fetchAllPosts, fetchPostComments, hidePost, unhidePost, deletePost, deleteComment } = useStaff();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    const data = await fetchAllPosts();
    setPosts(data);
    setLoading(false);
  }, [fetchAllPosts]);

  useEffect(() => { load(); }, [load]);

  const handleToggleComments = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    setExpandedPost(postId);
    if (!comments[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      const data = await fetchPostComments(postId);
      setComments((prev) => ({ ...prev, [postId]: data }));
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleHide = async (postId) => {
    const ok = await hidePost(postId);
    if (ok) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, hidden: true } : p));
    }
  };

  const handleUnhide = async (postId) => {
    const ok = await unhidePost(postId);
    if (ok) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, hidden: false } : p));
    }
  };

  const handleDeletePost = async (postId) => {
    const ok = await deletePost(postId);
    if (ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setConfirmDelete(null);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const ok = await deleteComment(commentId);
    if (ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));
      setPosts((prev) => prev.map((p) =>
        p.id === postId ? { ...p, comments_count: Math.max((p.comments_count || 1) - 1, 0) } : p
      ));
    }
  };

  const filtered = filter === 'all' ? posts
    : filter === 'visible' ? posts.filter((p) => !p.hidden)
    : posts.filter((p) => p.hidden);

  const hiddenCount = posts.filter((p) => p.hidden).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Community Moderation</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{posts.length} posts &middot; {hiddenCount} hidden</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {[
          { id: 'all', label: `All (${posts.length})` },
          { id: 'visible', label: `Visible (${posts.length - hiddenCount})` },
          { id: 'hidden', label: `Hidden (${hiddenCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              filter === tab.id ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-sm text-text-secondary">No posts to show.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => {
            const isExpanded = expandedPost === post.id;
            const postComments = comments[post.id] || [];
            const isLoadingComments = loadingComments[post.id];

            return (
              <div
                key={post.id}
                className={`rounded-lg border bg-white overflow-hidden ${post.hidden ? 'border-red/20 bg-red-soft/20' : 'border-border'}`}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-text-primary">{post.profiles?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-text-muted">{post.profiles?.email}</span>
                        {post.hidden && (
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold bg-red-soft text-red uppercase">Hidden</span>
                        )}
                        {post.post_type && post.post_type !== 'text' && (
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold bg-blue-soft text-blue uppercase">{post.post_type}</span>
                        )}
                      </div>
                      <p className="text-sm text-text-primary whitespace-pre-wrap">{post.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[10px] text-text-muted">{formatDateTime(post.created_at)}</span>
                        <span className="text-[10px] text-text-muted">{post.likes_count || 0} likes</span>
                        <button
                          onClick={() => handleToggleComments(post.id)}
                          className="inline-flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <MessageSquare className="h-3 w-3" />
                          {post.comments_count || 0} comments
                          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {post.hidden ? (
                        <button
                          onClick={() => handleUnhide(post.id)}
                          title="Unhide post"
                          className="p-1.5 rounded-md hover:bg-bg-alt text-text-muted hover:text-green transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleHide(post.id)}
                          title="Hide post"
                          className="p-1.5 rounded-md hover:bg-bg-alt text-text-muted hover:text-amber transition-colors"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {confirmDelete === post.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2 py-1 rounded-md bg-red text-white text-[10px] font-medium hover:bg-red/90"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 rounded-md border border-border text-[10px] font-medium text-text-muted hover:bg-bg-alt"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(post.id)}
                          title="Delete post"
                          className="p-1.5 rounded-md hover:bg-red-soft text-text-muted hover:text-red transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border-light px-4 py-3 bg-bg-alt/30 space-y-2">
                    {isLoadingComments ? (
                      <div className="flex items-center justify-center py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
                      </div>
                    ) : postComments.length === 0 ? (
                      <p className="text-xs text-text-muted py-2">No comments on this post.</p>
                    ) : (
                      postComments.map((comment) => (
                        <div key={comment.id} className="flex items-start justify-between gap-2 py-1.5">
                          <div className="min-w-0">
                            <span className="text-[11px] font-medium text-text-primary">{comment.profiles?.name || 'Unknown'}</span>
                            <span className="text-[10px] text-text-muted ml-2">{formatDateTime(comment.created_at)}</span>
                            <p className="text-xs text-text-primary mt-0.5">{comment.content}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            title="Delete comment"
                            className="p-1 rounded hover:bg-red-soft text-text-muted hover:text-red transition-colors shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
