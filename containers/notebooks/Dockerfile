FROM node:24
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /venv \
    && /venv/bin/pip install --upgrade pip && /venv/bin/pip install jupyterlab
RUN npm i -g deno \
    && deno jupyter --unstable --install --force
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && /usr/bin/code-server --install-extension ms-python.python \
    && /usr/bin/code-server --install-extension ms-toolsai.jupyter \
    && /usr/bin/code-server --install-extension vscodevim.vim \
    && /usr/bin/code-server --install-extension windmill-labs.windmill \
    && /usr/bin/code-server --install-extension denoland.vscode-deno
RUN corepack enable

CMD . /venv/bin/activate && /usr/bin/code-server --auth none --disable-telemetry --bind-addr 0.0.0.0:8887 /notebooks