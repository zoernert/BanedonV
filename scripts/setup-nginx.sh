#!/bin/bash

# BanedonV Nginx Setup Script
# Configure nginx for single port strategy (optional - for SSL termination)

set -e

# Configuration
DOMAIN="banedonv.local"
SERVER_NAME="10.0.0.14"
APP_PORT="3001"

echo "🔧 Setting up Nginx configuration for BanedonV..."

# Create nginx configuration
cat > /tmp/banedonv-nginx.conf << EOF
server {
    listen 80;
    server_name $SERVER_NAME $DOMAIN;
    
    # Redirect HTTP to HTTPS (production only)
    # return 301 https://\$server_name\$request_uri;
    
    # For development - proxy to application
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$APP_PORT/health;
        access_log off;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:$APP_PORT/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# SSL configuration (production)
server {
    listen 443 ssl http2;
    server_name $SERVER_NAME $DOMAIN;
    
    # SSL certificates
    ssl_certificate /etc/ssl/certs/banedonv.crt;
    ssl_certificate_key /etc/ssl/private/banedonv.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Proxy to application
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$APP_PORT/health;
        access_log off;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:$APP_PORT/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "📄 Nginx configuration created at /tmp/banedonv-nginx.conf"
echo ""
echo "To install this configuration:"
echo "1. Copy to nginx sites-available:"
echo "   sudo cp /tmp/banedonv-nginx.conf /etc/nginx/sites-available/banedonv"
echo ""
echo "2. Enable the site:"
echo "   sudo ln -s /etc/nginx/sites-available/banedonv /etc/nginx/sites-enabled/"
echo ""
echo "3. Test nginx configuration:"
echo "   sudo nginx -t"
echo ""
echo "4. Reload nginx:"
echo "   sudo systemctl reload nginx"
echo ""
echo "Note: This nginx configuration is OPTIONAL for the single-port strategy."
echo "The application already serves both frontend and API on port 3001."
echo "Use nginx only if you need SSL termination or additional load balancing."
