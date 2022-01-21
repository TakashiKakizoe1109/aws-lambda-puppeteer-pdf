FROM public.ecr.aws/lambda/nodejs:14

ARG LAMBDA_TASK_ROOT="/var/task"

RUN yum install -y \
    libX11 \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXtst \
    cups-libs \
    libXScrnSaver \
    libXrandr \
    alsa-lib \
    pango \
    atk \
    at-spi2-atk \
    gtk3 \
    google-noto-sans-japanese-fonts

COPY ./package.json ${LAMBDA_TASK_ROOT}
COPY ./package-lock.json ${LAMBDA_TASK_ROOT}
RUN npm install

COPY ./app.js ${LAMBDA_TASK_ROOT}

CMD ["app.handler"]
