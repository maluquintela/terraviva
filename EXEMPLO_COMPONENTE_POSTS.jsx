/**
 * EXEMPLO DE COMPONENTE: Feed de Posts da Cooperativa
 * 
 * Este é um exemplo de como usar os novos endpoints de posts de cooperativas.
 * Você pode copiar e adaptar este código para sua aplicação.
 */

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  fetchCooperativePosts,
  createCooperativePost,
  likePost,
  unlikePost,
  deletePost,
  createPostComment,
  fetchPostComments,
} from "../api/marketplace";

export default function CooperativeFeed({ cooperativeId }) {
  const { farmer } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Carregar posts ao montar o componente
  useEffect(() => {
    loadPosts();
  }, [cooperativeId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchCooperativePosts(cooperativeId, {
        skip: 0,
        limit: 20,
      });
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      alert("Erro ao carregar posts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setSubmitting(true);
      const newPost = await createCooperativePost(cooperativeId, {
        content: newPostContent,
      });

      // Adicionar o novo post no início da lista
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      alert("Post criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Erro ao criar post: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Curtir/descurtir post
  const handleToggleLike = async (postId, isLiked) => {
    try {
      const response = isLiked
        ? await unlikePost(postId)
        : await likePost(postId);

      // Atualizar o post na lista
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes_count: response.likes_count,
                isLiked: !isLiked,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Erro ao curtir:", error);
      alert(error.message);
    }
  };

  // Deletar post
  const handleDeletePost = async (postId) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      alert("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar post: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando posts...</div>;
  }

  return (
    <div className="cooperative-feed max-w-2xl mx-auto p-4">
      {/* Formulário para criar novo post */}
      {farmer && (
        <form
          onSubmit={handleCreatePost}
          className="mb-6 bg-white rounded-lg shadow p-4"
        >
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="O que você quer compartilhar com a cooperativa?"
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
              {submitting ? "Postando..." : "Publicar"}
            </button>
          </div>
        </form>
      )}

      {/* Lista de posts */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum post ainda. Seja o primeiro a postar!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentFarmer={farmer}
              onToggleLike={handleToggleLike}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para cada post
function PostCard({ post, currentFarmer, onToggleLike, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const isAuthor = currentFarmer?.id === post.farmer_id;
  const isLiked = post.isLiked || false; // TODO: implementar verificação se usuário curtiu

  // Carregar comentários
  const loadComments = async () => {
    if (comments.length > 0) return; // Já carregou

    try {
      setLoadingComments(true);
      const data = await fetchPostComments(post.id);
      setComments(data);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Adicionar comentário
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await createPostComment(post.id, {
        content: newComment,
      });

      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao comentar:", error);
      alert(error.message);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Cabeçalho do post */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {post.farmer.name[0].toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold">{post.farmer.name}</h4>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Botão de deletar (apenas para o autor) */}
        {isAuthor && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-500 hover:text-red-700"
            title="Deletar post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Conteúdo do post */}
      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Imagem (se houver) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Imagem do post"
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* Ações (curtir, comentar) */}
      <div className="flex items-center gap-4 pt-3 border-t">
        <button
          onClick={() => onToggleLike(post.id, isLiked)}
          className={`flex items-center gap-2 ${
            isLiked ? "text-red-500" : "text-gray-600"
          } hover:text-red-500 transition-colors`}
          disabled={!currentFarmer}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes_count}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {/* Seção de comentários */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          {loadingComments ? (
            <p className="text-center text-gray-500">Carregando comentários...</p>
          ) : (
            <>
              {/* Lista de comentários */}
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {comment.farmer.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg p-2">
                      <p className="font-semibold text-sm">
                        {comment.farmer.name}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulário para adicionar comentário */}
              {currentFarmer && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

