FROM python:3.12-slim
WORKDIR /srv
ENV PYTHONUNBUFFERED=1 DATA_DIR=/data JOB_TTL_HOURS=24
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
RUN useradd -m svc && mkdir -p /data && chown svc /data
USER svc
EXPOSE 8000
# API_KEY obrigatória (defina nas variáveis de ambiente do Railway/Render)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
