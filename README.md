# TerraViva

**Plataforma inteligente que conecta agricultores familiares a uma IA agrícola consultora e a um marketplace cooperativo**

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Instalação e Configuração](#instalação-e-configuração)
- [Credenciais de Teste](#5-credenciais-de-teste)
- [Documentação Completa](#documentação-completa)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Testando a API](#testando-a-api)

---

## Visão Geral

O **TerraViva** é uma plataforma completa que democratiza o acesso à tecnologia agrícola para pequenos e médios produtores rurais brasileiros. A plataforma combina:

- **Consultoria IA agrícola contextualizada** por região, clima, época do ano e orçamento
- **Marketplace cooperativo** para escoamento de produção
- **Sistema de chat** para formação de cooperativas
- **Diagnóstico inteligente** que alimenta recomendações personalizadas

### Como Funciona

1. **Diagnóstico Inicial**: O produtor responde 3 telas de perguntas sobre localização, orçamento e objetivos comerciais
2. **IA Contextualizada**: A partir do diagnóstico, a IA oferece consultoria técnica adaptada à realidade do produtor
3. **Marketplace**: Produtores podem anunciar excedentes e buscar produtos complementares
4. **Cooperativas**: Sistema de match e chat para formação de cooperativas

---

## Funcionalidades Principais

### 1. Autenticação e Perfil
- Login JWT seguro com hash bcrypt
- Perfil automático gerado com base no diagnóstico
- Nome do usuário exibido em toda a aplicação ("Olá, {nome}")

### 2. Diagnóstico em 3 Etapas
- **Tela 1 - Localização**: Cidade/estado → IA infere tipo de solo e clima
- **Tela 2 - Orçamento**: Valor mensal → IA limita recomendações ao orçamento real
- **Tela 3 - Interesses Comerciais**: Canal de venda e tipo de cooperação → IA adapta conselhos técnicos

### 3. Home
- **Assistência Técnica (Chatbot)**: Consultoria IA usando localização, solo, clima, orçamento e objetivos
- **Feed do Mercado**: Produtores no mesmo estado, ordenados por proximidade

### 4. Mercado (Marketplace)
- Busca por produtos filtrada por estado
- Perfil de produtores com excedentes disponíveis
- Sistema de favoritos e mensagens

### 5. Perfil de Outros Produtores
- Ver detalhes da produção
- Favoritar produtores
- Enviar mensagens diretas
- Solicitar criação de cooperativa

### 6. Meu Perfil
- Editar dados pessoais
- Gerenciar produtos em excesso
- Aceitar solicitações de cooperativa
- Ver produtores favoritados

### 7. Cooperativas (Sistema de Chat)
- **Chat Privado Individual**: Conversa 1-a-1 com outros produtores
- **Chat de Cooperativa (Grupo)**: Criado automaticamente ao aceitar solicitação
- **Administrador**: Quem enviou a primeira solicitação se torna admin do grupo
- Adicionar membros, gerenciar grupo

---

## Arquitetura do Sistema
