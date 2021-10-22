# https://www.duckdns.org/install.jsp?tab=osx-homebrew&domain=web2mqtt

brew tap jzelinskie/duckdns
brew install duckdns
ln -sfv /usr/local/opt/duckdns/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.duckdns.plist

cp .duckdns.org.sample $HOME/.duckdns
