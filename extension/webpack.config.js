import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

dotenv.config();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',

  entry: {
    contentScript: './src/content/index.js',
    background: './src/background/index.js',
    react: './src/react/index.jsx',
  },

  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/react/index.html',
      filename: 'index.html', // make sure it outputs to dist/index.html
      chunks: ['react'], // only include the React bundle
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'manifest.json'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: 'src/assets/',
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
    }),
  ],

  devServer: {
    static: './dist',
    port: 8080,
    open: true,
  },
};
