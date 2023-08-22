const htaccessTemplate = (nroBucket) => `
${nroBucket ? `
# BEGIN Reverse proxy

RewriteEngine On
RewriteRule ^static/${nroBucket}/(.*)$ http://www.greenpeace.org/static/${nroBucket}/$1 [R=301,L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^wp-content/uploads/(.*)$ http://www.greenpeace.org/static/${nroBucket}/$1 [R=301,L]

# END Reverse proxy
` : ''}

# BEGIN WordPress

RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]

# END WordPress
`;

module.exports = htaccessTemplate;
