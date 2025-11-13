/**
 * EXEMPLO: Feed tipo Tinder para formar cooperativas
 * 
 * Mostra cards de agricultores compatíveis baseado em:
 * - Proximidade geográfica
 * - Produtos complementares  
 * - Excedente disponível
 * 
 * Usuário pode:
 * - Ver perfil completo
 * - Clicar em "Conversar" para iniciar chat
 * - Buscar produtores específicos
 */

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, MapPin, Package, Search, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  fetchFeedRecommendations,
  fetchFarmerProfile,
  sendDirectMessage,
} from "../api/social";

export default function TinderFeedScreen() {
  const { farmer } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedRecommendations({ limit: 20 });
      setRecommendations(data);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      alert("Erro ao carregar recomendações");
    } finally {
      setLoading(false);
    }
  };

  const currentCard = recommendations[currentIndex];

  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Você chegou ao final! Carregando mais recomendações...");
      loadFeed();
      setCurrentIndex(0);
    }
  };

  const handleConversar = async () => {
    if (!currentCard) return;

    try {
      // Enviar mensagem inicial automática
      await sendDirectMessage(
        currentCard.farmer.id,
        `Olá! Vi seu perfil no TerraViva e gostaria de conversar sobre uma possível parceria. 😊`
      );

      alert(`Conversa iniciada com ${currentCard.farmer.name}!`);
      
      // Navegar para o chat
      navigate(`/chat/${currentCard.farmer.id}`);
    } catch (error) {
      console.error("Erro ao iniciar conversa:", error);
      alert("Erro ao iniciar conversa: " + error.message);
    }
  };

  const handleViewProfile = async () => {
    if (!currentCard) return;

    try {
      const profile = await fetchFarmerProfile(currentCard.farmer.id);
      setSelectedFarmer(profile);
      setShowProfile(true);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando produtores compatíveis...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhum produtor encontrado</h2>
          <p className="text-gray-600 mb-4">
            Não há mais recomendações no momento. Volte mais tarde!
          </p>
          <button
            onClick={loadFeed}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Encontre Parceiros 🤝
          </h1>
          <p className="text-gray-600">
            Produtores próximos e compatíveis com você
          </p>
        </div>

        {/* Card do produtor (estilo Tinder) */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 relative">
          {/* Badge de compatibilidade */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              {Math.round(currentCard.match_score)}% Match
            </div>
          </div>

          {/* Imagem/Avatar */}
          <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl font-bold text-green-600">
              {currentCard.farmer.name[0].toUpperCase()}
            </div>
          </div>

          {/* Informações */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              {currentCard.farmer.name}
            </h2>

            {/* Highlight */}
            <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg mb-4 text-center font-semibold">
              {currentCard.highlight}
            </div>

            {/* Localização */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin size={18} />
              <span>
                {currentCard.farmer.city}, {currentCard.farmer.state} • {currentCard.distance}
              </span>
            </div>

            {/* Produtos em comum */}
            {currentCard.products_in_common.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Produtos em comum:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentCard.products_in_common.map((product, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Produtos complementares */}
            {currentCard.can_complement.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Pode complementar com:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentCard.can_complement.slice(0, 4).map((product, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detalhes */}
            <div className="border-t pt-3 space-y-2 text-sm text-gray-600">
              <p>
                <Package className="inline mr-2" size={16} />
                Produção: {currentCard.farmer.production_weekly}
              </p>
              <p>
                <Check className="inline mr-2" size={16} />
                Excedente: {currentCard.farmer.surplus}
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="p-6 bg-gray-50 flex gap-4">
            <button
              onClick={handleNext}
              className="flex-1 py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={20} />
              Próximo
            </button>

            <button
              onClick={handleViewProfile}
              className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              Ver Perfil
            </button>

            <button
              onClick={handleConversar}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Conversar
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="text-center text-gray-600">
          {currentIndex + 1} de {recommendations.length} recomendações
        </div>
      </div>

      {/* Modal de Perfil Completo */}
      {showProfile && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedFarmer.farmer.name}</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Localização</p>
                <p className="text-gray-800">
                  {selectedFarmer.farmer.city}, {selectedFarmer.farmer.state} • {selectedFarmer.farmer.region}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">Culturas</p>
                <p className="text-gray-800">{selectedFarmer.farmer.crops}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">Sobre</p>
                <p className="text-gray-800">{selectedFarmer.bio}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">Produção Semanal</p>
                <p className="text-gray-800">{selectedFarmer.farmer.production_weekly}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">Excedente</p>
                <p className="text-gray-800">{selectedFarmer.farmer.surplus}</p>
              </div>

              {selectedFarmer.listings && selectedFarmer.listings.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Produtos Disponíveis
                  </p>
                  <div className="space-y-2">
                    {selectedFarmer.listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <p className="font-semibold">{listing.product?.name}</p>
                        <p className="text-sm text-gray-600">
                          {listing.quantity_total} {listing.product?.unit} • R$ {listing.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowProfile(false);
                  handleConversar();
                }}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Iniciar Conversa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

