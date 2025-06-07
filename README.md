# Kubernetes Web Application

React + Node.js + PostgreSQL を使用した Kubernetes デプロイ学習プロジェクト

## プロジェクト概要

Kubernetes の学習を目的とした 3 層アーキテクチャの Web アプリケーションです。
ユーザー管理機能を持つシンプルな Web アプリを通じて、コンテナ化から Kubernetes デプロイまでの一連の流れを学習します。

## 技術スタック

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Container**: Docker
- **Orchestration**: Kubernetes

## ディレクトリ構成

```txt:構成一覧
kubernetes-webapp-tutorial/
　├── README.md
　├── .gitignore
　├── docker-compose.yml
　├── frontend/                    # React アプリケーション
　│   ├── src/
　│   ├── package.json
　│   └── Dockerfile
　├── backend/                     # Node.js API サーバー
　│   ├── src/
　│   ├── server.js
　│   ├── package.json
　│   └── Dockerfile
　├── database/                    # PostgreSQL 初期化
　│   　└── init/
　│      　 └── 01-init.sql
　├── k8s/                        # Kubernetes マニフェスト
　│   ├── namespace.yaml
　│   ├── postgres/
　│   ├── backend/
　│   └── frontend/
　└── scripts/                    # デプロイスクリプト
  　  ├── build-images.sh
    　└── deploy-k8s.sh
```

## 構築手順

### 1. ローカル開発環境

```bash:環境構築
# プロジェクトクローン・移動
git clone https://github.com/kazukifukuyama14/kubernetes-webapp-tutorial.git
cd kubernetes-webapp-tutorial

# Backend起動
cd backend
npm install
npm run dev

# Frontend起動 (別ターミナル)
cd frontend
npm install
npm start
```

**確認 URL**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 2. Docker 環境

```bash:Dockerコマンド
# Docker Compose起動
docker-compose up --build

# 確認
docker-compose ps
```

### 3. Kubernetes 環境

```bash:Kubernetesコマンド
# Minikube起動
minikube start

# イメージビルド
./scripts/build-images.sh

# Kubernetesデプロイ
./scripts/deploy-k8s.sh

# 確認
kubectl get pods -n webapp
minikube service frontend-service -n webapp
```

### 4. 環境確認

各段階での動作確認：

- ユーザー一覧の表示
- API 接続の確認
- データベース接続の確認
