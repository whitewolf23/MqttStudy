const mosca = require('mosca');

const settings = {
  port : 1883,
  persistence : mosca.persistence.Memory
}

const server = new mosca.Server(settings, () => {
  console.log('모스카 서버 돌아가는중 ...')
})

server.clientConnected = (client) => {
  console.log('클라이언트 연결됨', client.id)
}

server.published = (packet, client, cb) => {
  if (packet.topic.indexOf('echo') === 0) {
    console.log('ON PUBLISH', packet.payload.toString(), 'on topic', packet.topic)
    return cb();
  }

  var newPacket = {
    topic : 'echo/' + packet.topic,
    payload : packet.payload,
    retain : packet.retain,
    qos : packet.qos
  }
  
  console.log('newPacket', newPacket)
  
  server.publish(newPacket, cb);
}

