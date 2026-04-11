import { useState, useEffect, useCallback } from 'react';
import {
  Users, Heart, MessageCircle, Send, Briefcase, TrendingUp,
  Trophy, Loader2, Trash2, ChevronDown, ChevronUp, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatCurrency(n) {
  return Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

function SharedDataCard({ postType, data }) {
  if (!data) return null;

  if (postType === 'portfolio') {
    return (
      <div className="mt-3 rounded-xl border border-border bg-bg-alt p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wide">
          <Briefcase className="h-3.5 w-3.5" /> Portfolio Snapshot
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Invested', value: formatCurrency(data.totalInvested) },
            { label: 'Current Value', value: formatCurrency(data.currentValue) },
            { label: 'Returns', value: formatCurrency(data.totalReturns), accent: true },
            { label: 'XIRR', value: `${data.xirr}%`, accent: true },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-text-muted">{s.label}</p>
              <p className={`text-sm font-semibold ${s.accent ? 'text-green' : 'text-text-primary'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (postType === 'investment') {
    return (
      <div className="mt-3 rounded-xl border border-border bg-bg-alt p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wide mb-2">
          <TrendingUp className="h-3.5 w-3.5" /> Investment
        </div>
        <p className="text-sm font-medium text-text-primary">{data.name}</p>
        <p className="text-xs text-text-muted mt-0.5">{data.productType}</p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <p className="text-[10px] text-text-muted">Invested</p>
            <p className="text-sm font-semibold text-text-primary">{formatCurrency(data.amountInvested)}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted">Current</p>
            <p className="text-sm font-semibold text-text-primary">{formatCurrency(data.currentValue)}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted">Return</p>
            <p className="text-sm font-semibold text-green">{data.returnPercent}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (postType === 'milestone') {
    return (
      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Trophy className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">{data.title}</p>
          <p className="text-xs text-amber-600">{data.description}</p>
        </div>
      </div>
    );
  }

  return null;
}

function CommentSection({ postId, onCommentAdded }) {
  const { fetchPostComments, createPostComment, session } = useApp();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPostComments(postId).then((data) => {
      if (!cancelled) { setComments(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [postId, fetchPostComments]);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    const comment = await createPostComment(postId, text);
    if (comment) {
      setComments((prev) => [...prev, comment]);
      setText('');
      onCommentAdded?.();
    } else {
      setError('Failed to post comment. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="border-t border-border pt-3 mt-3 space-y-3">
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
        </div>
      ) : (
        <>
          {comments.length === 0 && (
            <p className="text-xs text-text-muted text-center py-1">No comments yet. Start the conversation!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                {c.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-text-primary">{c.authorName}</span>
                  <span className="text-[10px] text-text-muted">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      {session && (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg border border-border bg-bg-alt px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onDelete, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const handleLike = async () => {
    const prevLiked = liked;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((c) => c + (newLiked ? 1 : -1));

    const result = await onLike(post.id, prevLiked);
    if (!result?.success) {
      setLiked(prevLiked);
      setLikesCount((c) => c + (prevLiked ? 1 : -1));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{post.authorName}</p>
            <p className="text-[10px] text-text-muted">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {currentUserId === post.userId && (
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <SharedDataCard postType={post.postType} data={post.sharedData} />

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            liked ? 'text-red-500' : 'text-text-muted hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          {likesCount > 0 && likesCount}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {commentsCount > 0 ? commentsCount : 'Comment'}
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}
    </div>
  );
}

function InvestmentPicker({ investments, onSelect, onClose }) {
  if (!investments.length) {
    return (
      <div className="rounded-xl border border-border bg-white p-5 text-center">
        <p className="text-sm text-text-secondary">No active investments to share yet.</p>
        <button onClick={onClose} className="mt-3 text-xs text-accent font-medium hover:underline">Close</button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-text-primary">Select an investment to share</p>
        <button onClick={onClose} className="p-1 rounded text-text-muted hover:text-text-primary"><X className="h-4 w-4" /></button>
      </div>
      {investments.map((inv) => (
        <button
          key={inv.id}
          onClick={() => onSelect(inv)}
          className="w-full text-left rounded-lg border border-border p-3 hover:bg-bg-alt transition-colors"
        >
          <p className="text-sm font-medium text-text-primary">{inv.name}</p>
          <p className="text-xs text-text-muted">{inv.productType} &middot; {formatCurrency(inv.amountInvested)}</p>
        </button>
      ))}
    </div>
  );
}

export default function Community() {
  const {
    fetchCommunityPosts, createCommunityPost, togglePostLike, deleteCommunityPost,
    portfolio, userInvestments, user, session,
  } = useApp();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState('');
  const [attachment, setAttachment] = useState(null); // { type, data }
  const [showInvestmentPicker, setShowInvestmentPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    const data = await fetchCommunityPosts();
    setPosts(data);
    setLoading(false);
  }, [fetchCommunityPosts]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleSharePortfolio = () => {
    setAttachment({
      type: 'portfolio',
      data: {
        totalInvested: portfolio.totalInvested,
        currentValue: portfolio.currentValue,
        totalReturns: portfolio.totalReturns,
        returnPercent: portfolio.returnPercent,
        xirr: portfolio.xirr,
      },
    });
    setShowInvestmentPicker(false);
  };

  const handleShareInvestment = (inv) => {
    setAttachment({
      type: 'investment',
      data: {
        name: inv.name,
        productType: inv.productType,
        amountInvested: inv.amountInvested,
        currentValue: inv.currentValue,
        returnPercent: inv.returnPercent,
      },
    });
    setShowInvestmentPicker(false);
  };

  const handleShareMilestone = () => {
    const pct = portfolio.returnPercent || 0;
    const title = pct > 0 ? `Crossed ${pct}% returns!` : 'Started my investment journey!';
    const description = pct > 0
      ? `Portfolio is now at ${formatCurrency(portfolio.currentValue)} with ${pct}% overall returns.`
      : 'Just made my first steps into alternative investments on YieldVest.';

    setAttachment({ type: 'milestone', data: { title, description } });
    if (!postText) setPostText(title);
    setShowInvestmentPicker(false);
  };

  const handleSubmitPost = async () => {
    if ((!postText.trim() && !attachment) || submitting) return;
    setSubmitting(true);

    const newPost = await createCommunityPost({
      content: postText.trim() || (attachment?.data?.title ?? 'Shared an update'),
      postType: attachment?.type || 'text',
      sharedData: attachment?.data || null,
    });

    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
      setPostText('');
      setAttachment(null);
    }
    setSubmitting(false);
  };

  const handleLike = async (postId, currentlyLiked) => {
    return await togglePostLike(postId, currentlyLiked);
  };

  const handleDelete = async (postId) => {
    const ok = await deleteCommunityPost(postId);
    if (ok) setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const currentUserId = session?.user?.id;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-accent" />
        <h1 className="text-xl font-semibold text-text-primary">Community</h1>
      </div>

      {/* Create Post */}
      <div className="rounded-xl border border-border bg-white p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Share your progress, a milestone, or thoughts with the community..."
            rows={3}
            className="flex-1 rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
          />
        </div>

        {attachment && (
          <div className="relative">
            <SharedDataCard postType={attachment.type} data={attachment.data} />
            <button
              onClick={() => setAttachment(null)}
              className="absolute top-2 right-2 p-1 rounded-full bg-white border border-border text-text-muted hover:text-text-primary shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {showInvestmentPicker && (
          <InvestmentPicker
            investments={userInvestments}
            onSelect={handleShareInvestment}
            onClose={() => setShowInvestmentPicker(false)}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleSharePortfolio}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                attachment?.type === 'portfolio'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-text-secondary hover:bg-bg-alt'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Portfolio
            </button>
            <button
              onClick={() => { setShowInvestmentPicker((v) => !v); setAttachment(null); }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                attachment?.type === 'investment'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-text-secondary hover:bg-bg-alt'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Investment
            </button>
            <button
              onClick={handleShareMilestone}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                attachment?.type === 'milestone'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-text-secondary hover:bg-bg-alt'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" /> Milestone
            </button>
          </div>
          <button
            onClick={handleSubmitPost}
            disabled={(!postText.trim() && !attachment) || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</>
            ) : (
              <><Send className="h-4 w-4" /> Post</>
            )}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-10 text-center space-y-2">
          <Users className="h-8 w-8 text-text-muted mx-auto" />
          <p className="text-sm font-medium text-text-primary">No posts yet</p>
          <p className="text-xs text-text-muted">Be the first to share your investment journey with the community!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
