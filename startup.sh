cat << EOT > .env
GOOGLE_CLIENT_ID={{ your_google_client_id}}
GOOGLE_CLIENT_SECRET={{ your_google_client_secret }}
JWT_SECRET={{ your_jwt_secret }}
MONGODB_URI=mongodb://user:password@localhost:27018/cantek_nextdoor_mongodb
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
EOT
