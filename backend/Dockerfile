FROM python:3.12-slim
WORKDIR /backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /backend/
RUN python manage.py collectstatic --noinput
RUN chmod +x build.sh
RUN ./build.sh

EXPOSE 8000
CMD ["gunicorn", "--workers", "3", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]