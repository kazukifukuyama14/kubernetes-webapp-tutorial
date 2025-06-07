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
.
├── backend/                 # Node.js/Express バックエンド
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── database/                # データベース初期化
│   └── init/
│       └── 01-init.sql
├── docker-compose.yml       # 開発用Docker Compose
├── frontend/                # React フロントエンド
│   ├── Dockerfile
│   ├── nginx.conf          # Nginx設定ファイル
│   ├── package-lock.json
│   ├── package.json
│   ├── public/             # 静的ファイル
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md           # Create React App デフォルトREADME
│   └── src/                # Reactソースコード
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── k8s/                    # Kubernetes マニフェストファイル
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── configmap.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   ├── postgres-deployment.yml
│   └── postgres-service.yml
└── README.md               # プロジェクトメインREADME
```

## 前提条件

以下のツールがインストールされている必要があります：

- Docker Desktop (最新版)
- Minikube (v1.25+)
- kubectl (Kubernetes クライアント)
- Git

## クイックスタート

### 1. リポジトリのクローン

```bash:
git clone https://github.com/kazukifukuyama14/kubernetes-webapp-tutorial.git
cd kubernetes-webapp-tutorial
```

### 2. Minikube の起動

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

### 3.Minikube Docker 環境に切り替え

```bash
eval $(minikube docker-env)
```

### 4.Docker イメージのビルド

```bash
# バックエンドイメージ
docker build -t webapp-backend:latest ./backend

# フロントエンドイメージ
docker build -t webapp-frontend:latest ./frontend
```

### 5. Kubernetes リソースのデプロイ

```bash
# データベース
kubectl apply -f k8s/postgres-deployment.yml
kubectl apply -f k8s/postgres-service.yml

# ConfigMap
kubectl apply -f k8s/configmap.yml

# バックエンド
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml

# フロントエンド
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
```

### 6. アプリケーションへのアクセス

```bash
minikube service webapp-frontend-service
```

## 詳細セットアップ手順

### Pod 起動状況の確認

### ログの確認

```bash
kubectl get pods
```

全ての Pod が `Running` 状態になるまで待機してください。

### サービス確認

```bash
kubectl get services
```

### ログ確認

```bash
# バックエンドログ
kubectl logs -l app=webapp-backend

# フロントエンドログ
kubectl logs -l app=webapp-frontend

# データベースログ
kubectl logs -l app=postgres
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. `ErrImageNeverPull` エラー

症状: Pod が `ErrImageNeverPull` 状態になる

原因: Minikube の Docker 環境でイメージがビルドされていない

解決方法:

```bash
# Minikube Docker環境に切り替え
eval $(minikube docker-env)

# イメージを再ビルド
docker build -t webapp-backend:latest ./backend
docker build -t webapp-frontend:latest ./frontend
```

#### 2. nginx 設定が反映されない

症状: 設定変更後も Pod 内の設定が古いまま

解決方法:

```bash
# Dockerキャッシュをクリア
docker system prune -a -f

# イメージを完全再ビルド
docker build --no-cache -t webapp-frontend:latest ./frontend

# デプロイメントを再作成
kubectl delete deployment webapp-frontend-deployment
kubectl apply -f k8s/frontend-deployment.yml
```

#### 3. API 接続エラー

症状: フロントエンドからバックエンド API にアクセスできない

確認方法:

```bash
# バックエンドサービス確認
kubectl exec -it $(kubectl get pods -l app=webapp-frontend -o jsonpath='{.items[0].metadata.name}') -- curl http://webapp-backend-service:3001/api/users
```

#### 4. データベース接続エラー

確認方法:

```bash
# PostgreSQL接続テスト
kubectl exec -it $(kubectl get pods -l app=postgres -o jsonpath='{.items[0].metadata.name}') -- psql -U postgres -d webapp -c "SELECT * FROM users;"
```

## アーキテクチャ

```txt
[ブラウザ]
    ↓ HTTP
[Minikube Service]
    ↓
[Frontend Pod (React + Nginx)]
    ↓ /api/* → プロキシ
[Backend Pod (Node.js/Express)]
    ↓ SQL
[PostgreSQL Pod]
    ↓
[Persistent Volume]
```

## 開発・カスタマイズ

### 新しい機能の追加

1. フロントエンド変更: `frontend/src/` 配下を編集
2. バックエンド変更: `backend/server.js` を編集
3. データベーススキーマ変更: `backend/schema.sql` を編集

### 変更の反映

```bash
# 変更後は必ずイメージを再ビルド
eval $(minikube docker-env)
docker build -t webapp-frontend:latest ./frontend
docker build -t webapp-backend:latest ./backend

# デプロイメントを再起動
kubectl rollout restart deployment/webapp-frontend-deployment
kubectl rollout restart deployment/webapp-backend-deployment
```

## クリーンアップ

### リソースの削除

```bash
# 全てのリソースを削除
kubectl delete -f k8s/

# Minikube停止
minikube stop

# Minikube削除（完全クリーンアップ）
minikube delete
```

## 最後に

掲載したもので不手際ありましたら Pull Request や issue の報告をお願いします 🙇‍♂️

## 参考資料

- [Kubernetes 公式ドキュメント](https://kubernetes.io/docs/home/)
- [Minikube 公式ドキュメント](https://minikube.sigs.k8s.io/docs/)
- [Docker 公式ドキュメント](https://docs.docker.com/)
