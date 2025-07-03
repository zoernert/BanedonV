#!/bin/bash
set -e

# This script provides a basic setup for Postfix as a local-only SMTP server.
# It's intended for development and testing, not for production internet email.

echo "Configuring Postfix for local mail delivery..."

# Install Postfix if it's not already installed
if ! command -v postfix > /dev/null; then
  echo "Postfix not found. Installing..."
  # This will prompt for configuration. Choose 'Internet Site' and use the default system mail name.
  # For a fully non-interactive install, you can pre-seed debconf.
  debconf-set-selections <<< "postfix postfix/mailname string localhost"
  debconf-set-selections <<< "postfix postfix/main_mailer_type string 'Internet Site'"
  apt-get update
  apt-get install -y postfix
fi

# Configure Postfix for local delivery only
postconf -e "inet_interfaces = loopback-only"
postconf -e "mydestination = localhost, localhost.localdomain, localhost"
postconf -e "mynetworks_style = host"

# Restart Postfix to apply changes
service postfix restart

echo "✅ Postfix configured for local mail delivery."

# You can test the setup with:
# echo "This is a test email." | mail -s "Test Subject" your-local-user@localhost
