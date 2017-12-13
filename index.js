"use strict";
const rp = require('request-promise')
const crypto = require('crypto')
const nonce = require('nonce')()

class Cryptopia {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
    this.API_URL = 'https://www.cryptopia.co.nz/api/'
  }

  _public (endpoint, parameters) {
    let httpParam = '/'
    for (let key in parameters) {
      if (parameters[key]) {
        httpParam += parameters[key] + '/'
      }
    }
    const options = {
      method: 'GET',
      uri: this.API_URL + endpoint + httpParam,
      json: true
    }

    return rp(options)
  }

   GetCurrencies () {
    return this._public('GetCurrencies')
  }

   GetTradePairs () {
    return this._public('GetTradePairs')
  }

   GetMarkets (baseMarket, hours) {
    return this._public('GetMarkets', {baseMarket, hours})
  }

   GetMarket (market, hours) {
    return this._public('GetMarket', {market, hours})
  }

   GetMarketHistory (market, hours) {
    return this._public('GetMarketHistory', {market, hours})
  }

   GetMarketOrders (market, orderCount) {
    return this._public('GetMarketOrders', {market, orderCount})
  }

   GetMarketOrderGroups (markets, orderCount) {
    return this._public('GetMarketOrderGroups', {markets, orderCount})
  }

  _private (endpoint, parameters) {
    const _nonce = nonce()
    const HASHED_POST_PARAMS = crypto.createHash('md5').update(JSON.stringify(parameters)).digest('base64')
    const requestSignature = this.key + 'POST' + encodeURIComponent(this.API_URL + endpoint).toLowerCase() + _nonce + HASHED_POST_PARAMS
    const hmacSignature = crypto.createHmac('sha256', Buffer.from(this.secret, 'base64')).update(requestSignature).digest('base64')
    const authorization = 'amx ' + this.key + ':' + hmacSignature + ':' + _nonce

    const options = {
      method: 'POST',
      uri: this.API_URL + endpoint,
      body: parameters,
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(JSON.stringify(parameters))
      },
      json: true
    }

    return rp(options)
  }

   GetBalance (Currency) {
    return this._private('GetBalance', {Currency})
  }

   GetDepositAddress (Currency) {
    return this._private('GetDepositAddress', {Currency})
  }

   GetOpenOrders (Market, TradePairId, Count) {
    return this._private('GetOpenOrders', {Market, TradePairId, Count})
  }
   GetTradeHistory (Market, TradePairId, Count) {
    return this._private('GetTradeHistory', {Market, TradePairId, Count})
  }

   GetTransactions (Type, Count) {
    return this._private('GetTransactions', {Type, Count})
  }

   SubmitTrade (Market, TradePairId, Type, Rate, Amount) {
    return this._private('SubmitTrade', {Market, TradePairId, Type, Rate, Amount})
  }

   CancelTrade (Type, OrderId, TradePairId) {
    return this._private('CancelTrade', {Type, OrderId, TradePairId})
  }

   SubmitTip (Currency, ActiveUsers, Amount) {
    return this._private('SubmitTip', {Currency, ActiveUsers, Amount})
  }

   SubmitWithdraw (Currency, Address, PaymentId, Amount) {
    return this._private('SubmitWithdraw', {Currency, Address, PaymentId, Amount})
  }

   SubmitTransfer (Currency, Username, Amount) {
    return this._private('SubmitTransfer', {Currency, Username, Amount})
  }
}

module.exports = Cryptopia
