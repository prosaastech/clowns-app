echo "Switching to branch develop"
git checkout develop

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -P 53572 -r build/* clown@154.12.254.188:/var/www/154.12.254.188/

echo "Done!"