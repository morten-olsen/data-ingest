import mqtt from 'mqtt';
import { EventEmitter } from 'eventemitter3';

type MqttServiceEvents = {
  message: (topic: string, message: unknown) => void;
};

class MqttService extends EventEmitter<MqttServiceEvents> {
  #client?: Promise<mqtt.MqttClient>;

  #getClient() {
    if (!this.#client) {
      this.#client = new Promise((resolve) => {
        const brokerUrl = process.env.MQTT_BROKER_URL;
        if (!brokerUrl) {
          throw new Error('MQTT_BROKER_URL is not set');
        }
        console.log('Connecting to MQTT broker', brokerUrl);
        const client = mqtt.connect(brokerUrl);
        client.on('connect', () => {
          console.log('Connected to MQTT broker');
          resolve(client);
          client.on('message', (topic, message) => {
            try {
              this.emit('message', topic, JSON.parse(message.toString()));
            } catch (err) {
              console.error(err);
            }
          });
        });
      });
    }
    return this.#client;
  }

  public subscribe = async (topic: string) => {
    const client = await this.#getClient();
    return new Promise<void>((resolve, reject) => {
      client.subscribe(topic, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  public publish = async (topic: string, message: unknown) => {
    const client = await this.#getClient();
    return new Promise<void>((resolve, reject) => {
      client.publish(topic, JSON.stringify(message), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}

export { MqttService };
