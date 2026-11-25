# Toolbox image: Playwright browsers + Node, plus pnpm. Everything runs in
# here so nothing is installed on the host machine.
FROM mcr.microsoft.com/playwright:v1.65.1-noble

RUN npm install -g pnpm@10

ENV CI=1
