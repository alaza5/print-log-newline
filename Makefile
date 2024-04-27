install:
	vsce package --allow-missing-repository
	code --install-extension print-log-newline-1.0.0.vsix
