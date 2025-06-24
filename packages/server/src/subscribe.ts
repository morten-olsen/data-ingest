import { Container } from './utils/container.js';
import { MqttService } from './services/services.mqtt.js';
import { DocumentsService } from './services/services.documents.js';
import { documentUpsertSchema } from './schemas/schemas.js';

const subscribe = async (container: Container) => {
  const mqttService = container.get(MqttService);
  const documentsService = container.get(DocumentsService);

  mqttService.on('message', (topic, message) => {
    try {
      if (!topic.startsWith('ingest/')) {
        return;
      }
      const validMessage = documentUpsertSchema.parse(message);
      documentsService.upsert(validMessage);
    } catch (error) {
      console.error(error);
    }
  });

  await mqttService.subscribe('ingest/#');
};

export { subscribe };
