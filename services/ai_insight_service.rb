# frozen_string_literal: true

# Gera uma leitura simples do relatório diário para apoiar decisões no campo.
class AIInsightService
  def initialize(report)
    @report = report || {}
  end

  def call
    {
      resumo_do_dia: resumo_do_dia,
      pontos_de_atencao: pontos_de_atencao,
      recomendacao_pratica: recomendacao_pratica,
      mensagem_whatsapp: mensagem_whatsapp
    }
  end

  private

  attr_reader :report

  def chuva_mm
    report[:chuva_mm].to_f
  end

  def temperatura_max_c
    report[:temperatura_max_c].to_f
  end

  def umidade_pct
    report[:umidade_pct].to_f
  end

  def vento_kmh
    report[:vento_kmh].to_f
  end

  def data_referencia
    report[:data] || 'hoje'
  end

  def resumo_do_dia
    partes = []
    partes << "Em #{data_referencia}, a temperatura chegou a #{temperatura_max_c.round(1)}°C."
    partes << "A chuva acumulada foi de #{chuva_mm.round(1)} mm."
    partes << "A umidade ficou em torno de #{umidade_pct.round}%."
    partes.join(' ')
  end

  def pontos_de_atencao
    alertas = []

    alertas << 'Calor forte: redobre atenção com estresse hídrico das plantas.' if temperatura_max_c >= 32
    alertas << 'Baixa umidade: risco de perda de água no solo.' if umidade_pct <= 40
    alertas << 'Chuva alta: observar encharcamento e dificuldade de entrada no talhão.' if chuva_mm >= 25
    alertas << 'Vento forte: evitar aplicação com pulverizador para não perder produto.' if vento_kmh >= 20

    return alertas if alertas.any?

    ['Dia estável, sem alerta crítico no relatório.']
  end

  def recomendacao_pratica
    if chuva_mm >= 20
      'Priorize drenagem e adie operações pesadas até o solo firmar.'
    elsif temperatura_max_c >= 32 && umidade_pct <= 40
      'Se possível, ajuste a irrigação para o começo da manhã ou fim da tarde.'
    elsif vento_kmh >= 20
      'Programe pulverizações para horários com menos vento.'
    else
      'Mantenha o manejo planejado e faça vistoria rápida nas áreas mais sensíveis.'
    end
  end

  def mensagem_whatsapp
    <<~MSG.strip
      📍 Relatório da estação (#{data_referencia})
      Resumo: #{resumo_do_dia}
      Atenção: #{pontos_de_atencao.join(' ')}
      Recomendação: #{recomendacao_pratica}
    MSG
  end
end
