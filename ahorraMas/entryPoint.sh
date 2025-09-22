# #!/bin/bash
# set -xe
# : "${VITE_API_URL?Need an apiadm url}"


# sed -i "s#VITE_API_URL_REPLACE/$VITE_API_URL/g" /var/www/app/env.js


# exec "$@"


#!/bin/bash
set -xe
: "${VITE_API_URL?Need an api url}"


sed -i "s/VITE_API_URL_REPLACE/$VITE_API_URL/g" /var/www/app/env.js


exec "$@"