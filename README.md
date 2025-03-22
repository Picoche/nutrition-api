# API d'Informations Nutritionnelles pour Nori Marketplace

Une API simple pour récupérer les informations nutritionnelles et les ingrédients des produits alimentaires en fonction de leur nom. Cette API est spécialement conçue pour s'intégrer à l'application Nori Marketplace.

## Fonctionnalités

- **Recherche de Produits**: Trouvez des produits par nom avec correspondance approximative
- **Informations Nutritionnelles**: Obtenez des données nutritionnelles détaillées
- **Liste d'Ingrédients**: Obtenez les ingrédients des produits

## Installation

```bash
# Cloner le dépôt
git clone <url-du-dépôt>

# Naviguer vers le répertoire du projet
cd nutritional-api

# Installer les dépendances
npm install
```

## Configuration

Créez un fichier `.env` dans le répertoire racine avec les variables suivantes:

```
PORT=3001
# Ajoutez d'autres variables d'environnement selon les besoins
```

## Utilisation

### Démarrer le serveur

```bash
# Mode développement avec rechargement automatique
npm run dev

# Mode production
npm start
```

Le serveur démarrera sur `http://localhost:3001` (ou sur le PORT spécifié dans votre fichier .env).

## Points de Terminaison de l'API

### Vérification de l'État

```
GET /health
```

Renvoie l'état de l'API.

### Obtenir Tous les Produits

```
GET /api/products
```

Renvoie une liste de tous les produits avec leurs informations nutritionnelles.

### Rechercher un Produit

```
GET /api/products/search?name=<nom_du_produit>
```

Recherchez un produit par son nom et obtenez ses informations nutritionnelles et ses ingrédients. La recherche utilise une correspondance approximative pour trouver la correspondance la plus proche de votre requête.

#### Paramètres

- `name`: Le nom du produit à rechercher (obligatoire)

#### Réponse

```json
{
  "ingredients": ["Ingrédient 1", "Ingrédient 2", ...],
  "nutritionalInfo": {
    "calories": 250,
    "protein": "9g",
    "carbs": "48g",
    "fat": "2g"
  }
}
```

## Données

L'API est livrée avec un ensemble prédéfini de produits dans le fichier `data/products.json`. Vous pouvez modifier ce fichier pour ajouter ou modifier les données des produits disponibles sur Nori Marketplace. 