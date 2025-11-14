import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, MapPin, Package, X, Check, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchFeedRecommendations,
  fetchFarmerProfile,
} from "../../api/social";
import "./redesocial.css";

export default function RedeSocialScreen() {
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
    } finally {
      setLoading(false);
    }
  };

  const currentCard = recommendations[currentIndex];

  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      loadFeed();
      setCurrentIndex(0);
    }
  };

  const handleConversar = () => {
    if (!currentCard) return;
    navigate(`/chat/${currentCard.farmer.id}`, {
      state: { farmer: currentCard.farmer }
    });
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
      <div className="rede-social">
        <div className="rede-social__loading">
          <div className="rede-social__spinner"></div>
          <p>Buscando produtores compatíveis...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="rede-social">
        <div className="rede-social__empty">
          <Heart size={64} className="rede-social__empty-icon" />
          <h2>Nenhum produtor encontrado</h2>
          <p>Não há mais recomendações no momento. Volte mais tarde!</p>
          <button onClick={loadFeed} className="rede-social__btn-reload">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rede-social">
      <div className="rede-social__container">
        {/* Header */}
        <div className="rede-social__header">
          <button
            className="rede-social__back-btn"
            onClick={() => navigate("/")}
            aria-label="Voltar"
          >
            <span>&lt;</span>
          </button>
          <h1>Encontre Parceiros</h1>
          <div className="rede-social__spacer"></div>
        </div>

        <p className="rede-social__subtitle">
          Produtores próximos e compatíveis com você
        </p>

        {/* Card do produtor (estilo Tinder) */}
        <div className="rede-social__card">
          {/* Badge de compatibilidade */}
          <div className="rede-social__badge">
            {Math.round(currentCard.match_score)}% Match
          </div>

          {/* Imagem/Avatar */}
          <div className="rede-social__avatar">
            <div className="rede-social__avatar-circle">
              {currentCard.farmer.name[0].toUpperCase()}
            </div>
          </div>

          {/* Informações */}
          <div className="rede-social__info">
            <h2>{currentCard.farmer.name}</h2>

            {/* Highlight */}
            <div className="rede-social__highlight">
              {currentCard.highlight}
            </div>

            {/* Localização */}
            <div className="rede-social__location">
              <MapPin size={18} />
              <span>
                {currentCard.farmer.city}, {currentCard.farmer.state} • {currentCard.distance}
              </span>
            </div>

            {/* Produtos em comum */}
            {currentCard.products_in_common && currentCard.products_in_common.length > 0 && (
              <div className="rede-social__section">
                <p className="rede-social__section-title">
                  Produtos em comum:
                </p>
                <div className="rede-social__tags">
                  {currentCard.products_in_common.map((product, idx) => (
                    <span key={idx} className="rede-social__tag rede-social__tag--green">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Produtos complementares */}
            {currentCard.can_complement && currentCard.can_complement.length > 0 && (
              <div className="rede-social__section">
                <p className="rede-social__section-title">
                  Pode complementar com:
                </p>
                <div className="rede-social__tags">
                  {currentCard.can_complement.slice(0, 4).map((product, idx) => (
                    <span key={idx} className="rede-social__tag rede-social__tag--blue">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detalhes */}
            <div className="rede-social__details">
              {currentCard.farmer.production_weekly && (
                <p>
                  <Package size={16} />
                  Produção: {currentCard.farmer.production_weekly}
                </p>
              )}
              {currentCard.farmer.surplus && (
                <p>
                  <Check size={16} />
                  Excedente: {currentCard.farmer.surplus}
                </p>
              )}
            </div>

            {/* Razões */}
            {currentCard.reasons && currentCard.reasons.length > 0 && (
              <div className="rede-social__reasons">
                <p className="rede-social__reasons-title">
                  <TrendingUp size={16} />
                  Por que recomendamos:
                </p>
                <ul>
                  {currentCard.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="rede-social__actions">
            <button
              onClick={handleNext}
              className="rede-social__btn rede-social__btn--next"
              aria-label="Próximo produtor"
            >
              <X size={20} />
              Próximo
            </button>

            <button
              onClick={handleViewProfile}
              className="rede-social__btn rede-social__btn--profile"
              aria-label="Ver perfil completo"
            >
              Ver Perfil
            </button>

            <button
              onClick={handleConversar}
              className="rede-social__btn rede-social__btn--conversar"
              aria-label="Iniciar conversa"
            >
              <MessageCircle size={20} />
              Conversar
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="rede-social__counter">
          {currentIndex + 1} de {recommendations.length} recomendações
        </div>
      </div>

      {/* Modal de Perfil Completo */}
      {showProfile && selectedFarmer && (
        <div className="rede-social__modal" onClick={() => setShowProfile(false)}>
          <div
            className="rede-social__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rede-social__modal-header">
              <h2>{selectedFarmer.farmer.name}</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="rede-social__modal-close"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>

            <div className="rede-social__modal-body">
              <div className="rede-social__modal-item">
                <p className="rede-social__modal-label">Localização</p>
                <p className="rede-social__modal-value">
                  {selectedFarmer.farmer.city}, {selectedFarmer.farmer.state}
                  {selectedFarmer.farmer.region && ` • ${selectedFarmer.farmer.region}`}
                </p>
              </div>

              {selectedFarmer.farmer.crops && (
                <div className="rede-social__modal-item">
                  <p className="rede-social__modal-label">Culturas</p>
                  <p className="rede-social__modal-value">{selectedFarmer.farmer.crops}</p>
                </div>
              )}

              <div className="rede-social__modal-item">
                <p className="rede-social__modal-label">Sobre</p>
                <p className="rede-social__modal-value">{selectedFarmer.bio}</p>
              </div>

              {selectedFarmer.farmer.production_weekly && (
                <div className="rede-social__modal-item">
                  <p className="rede-social__modal-label">Produção Semanal</p>
                  <p className="rede-social__modal-value">{selectedFarmer.farmer.production_weekly}</p>
                </div>
              )}

              {selectedFarmer.farmer.surplus && (
                <div className="rede-social__modal-item">
                  <p className="rede-social__modal-label">Excedente</p>
                  <p className="rede-social__modal-value">{selectedFarmer.farmer.surplus}</p>
                </div>
              )}

              {selectedFarmer.listings && selectedFarmer.listings.length > 0 && (
                <div className="rede-social__modal-item">
                  <p className="rede-social__modal-label">Produtos Disponíveis</p>
                  <div className="rede-social__modal-listings">
                    {selectedFarmer.listings.map((listing) => (
                      <div key={listing.id} className="rede-social__modal-listing">
                        <p className="rede-social__modal-listing-name">
                          {listing.product?.name}
                        </p>
                        <p className="rede-social__modal-listing-info">
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
                className="rede-social__modal-btn"
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

