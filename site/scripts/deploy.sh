source .env

echo "Deploying service to Google Cloud Run..."
gcloud run deploy $CLOUD_RUN_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO_NAME/$IMAGE_NAME:latest \
    --region $REGION \
    --service-account=$SERVICE_ACCOUNT \
    --project=$PROJECT_ID

# Update traffic to the latest version
echo "Updating traffic to the latest version..."
gcloud run services update-traffic $CLOUD_RUN_NAME --to-latest --project=$PROJECT_ID

echo "Production deployment complete!"
