import { describe, it, expect } from 'vitest'
import {
  formatCPFOrCNPJ,
  formatPhone,
  formatCEP,
  formatCurrencyInput,
  parseCurrencyToNumber,
} from '@/lib/formatters'

describe('Formatters', () => {
  describe('formatCPFOrCNPJ', () => {
    it('should format a valid CPF', () => {
      expect(formatCPFOrCNPJ('12345678901')).toBe('123.456.789-01')
    })
    it('should format a valid CNPJ', () => {
      expect(formatCPFOrCNPJ('12345678000190')).toBe('12.345.678/0001-90')
    })
    it('should format partial CPF', () => {
      expect(formatCPFOrCNPJ('123456')).toBe('123.456')
    })
  })

  describe('formatPhone', () => {
    it('should format a landline phone', () => {
      expect(formatPhone('1140028922')).toBe('(11) 4002-8922')
    })
    it('should format a mobile phone', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
    })
  })

  describe('formatCEP', () => {
    it('should format a CEP', () => {
      expect(formatCEP('12345678')).toBe('12345-678')
    })
  })

  describe('formatCurrencyInput', () => {
    it('should format numbers to BRL currency string', () => {
      // Int.NumberFormat uses non-breaking spaces, so we just check for parts
      const result = formatCurrencyInput('1500')
      expect(result).toContain('15,00')
      expect(result).toContain('R$')
    })
    it('should handle empty input', () => {
      expect(formatCurrencyInput('')).toBe('')
    })
  })

  describe('parseCurrencyToNumber', () => {
    it('should parse formatted currency to number', () => {
      expect(parseCurrencyToNumber('R$ 15,00')).toBe(15)
      expect(parseCurrencyToNumber('1500')).toBe(15)
    })
    it('should handle empty input', () => {
      expect(parseCurrencyToNumber('')).toBe(0)
    })
  })
})
