FROM nginx:alpine

LABEL org.opencontainers.image.title="cocktails-site" \
      org.opencontainers.image.description="Menu cocktails statico, tema scuro" \
      org.opencontainers.image.licenses="MIT"

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css script.js /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
