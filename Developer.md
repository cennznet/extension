## Publishing to Chrome Web Store

**Permission Justification**  
- Storage API required to persist local user data  
- Tabs API required to redirect from phishing sites and allow opening extension UI in another, standalone tab  
- Host permisison is implicitly requested to enable 'content scripts'. This is the 'injected' js from the extension onto any dapp web page which
wants to interact with the extension.
helpful link: https://thoughtbot.com/blog/how-to-make-a-chrome-extension  
