# Your GitHub Learning Lab Repository for Introducing GitHub

Welcome to **your** repository for your GitHub Learning Lab course. This repository will be used during the different activities that I will be guiding you through. See a word you don't understand? We've included an emoji 📖 next to some key terms. Click on it to see its definition.

Oh! I haven't introduced myself...

I'm the GitHub Learning Lab bot and I'm here to help guide you in your journey to learn and master the various topics covered in this course. I will be using Issue and Pull Request comments to communicate with you. In fact, I already added an issue for you to check out.

![issue tab](https://lab.github.com/public/images/issue_tab.png)

I'll meet you over there, can't wait to get started!

This course is using the :sparkles: open source project [reveal.js](https://github.com/hakimel/reveal.js/). In some cases we’ve made changes to the history so it would behave during class, so head to the original project repo to learn more about the cool people behind this project.

## API de relatório diário

Foi adicionado um endpoint HTTP para consolidar as leituras das últimas 24h por estação.

### Executar

```bash
node api/server.js
```

### Endpoint

`GET /daily-report/{station_id}`

Exemplo:

```bash
curl http://localhost:3000/daily-report/station-1
```

Resposta:
- `readings_count`: quantidade de leituras
- `indicators`: média, mínima e máxima por indicador
- `last_reading`: última leitura registrada
- `overall_status`: `normal`, `atenção` ou `crítico`
- `indicators_out_of_range`: lista de indicadores fora da faixa normal na última leitura
