# eBay Tracker

A powerful tool built with Nuxt.js to track eBay live and sold item data, visualize trends, and analyze market insights.

## Features

- **Live & Sold Data Tracking**: Monitor real-time and historical eBay listings.
- **Interactive Charts**: Visualize data using histograms and line charts for better trend analysis.
- **Advanced Filtering**: Refine search results with comprehensive filtering options for both live and sold items.
- **Item Summaries**: Quick overview of individual item details.
- **Responsive UI**: Enhanced theming and user experience.
- **SEO Optimized**: Improved search engine optimization for better discoverability.
- **Docker Support**: Containerized environment for easy setup and deployment.
- **Heroku Deployment**: Optimized for deployment on Heroku.

## Setup

To get this project up and running, follow these steps:

### Prerequisites

- Node.js (v18 or higher recommended)
- Yarn or npm
- Git
- eBay Developer Account (for API keys)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ebay-tracker.git # Replace with actual repo URL
cd ebay-tracker
```

### 2. Install Dependencies

```bash
# using yarn
yarn install

# or using npm
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory of the project based on `.env.example` (if present, otherwise create it) and add your eBay API keys:

```
EBAY_CLIENT_ID=YOUR_EBAY_CLIENT_ID
EBAY_CLIENT_SECRET=YOUR_EBAY_CLIENT_SECRET
# Add any other necessary environment variables
```

*Note*: The exact environment variables might vary based on the actual implementation of `useEbayAuth.js`, `ebayAuth.ts`, etc. Refer to the server API files for precise variable names.

## Development Server

Start the development server:

```bash
# using yarn
yarn dev

# or using npm
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Building for Production

To build the application for production:

```bash
# using yarn
yarn build

# or using npm
npm run build
```

Then, you can preview the production build locally:

```bash
# using yarn
yarn preview

# or using npm
npm run preview
```

## Deployment

### Docker

You can build and run the application using Docker:

```bash
docker build -t ebay-tracker .
docker run -p 3000:3000 ebay-tracker
```

### Heroku

This project includes a `heroku.yml` for simplified deployment to Heroku. Follow Heroku's documentation for deploying Node.js applications with a `heroku.yml` build manifest. Ensure your environment variables are configured on Heroku.

## Usage

Once the application is running, you can:
- Search for live and sold eBay listings.
- Apply various filters to narrow down your results.
- View data trends through interactive charts.
- Get detailed summaries for individual items.

## Contributing

Feel free to open issues or submit pull requests.

## License

[MIT License](LICENSE) (or other appropriate license)