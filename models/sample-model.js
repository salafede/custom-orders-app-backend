const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  id: String || Object,
  store: String,
  created_at: Date,
  updated_at: Date,
  send_to_stef_at: Date,
  sync_to_shopify_at: Date,
  pickup: Date,
  parsedValue: Number,
  ticket: String, // id etichetta ? 
  data: {
    id: String || Object,
    totalWeight: String || Number,
    note: String,
    name: String,
    clientIp: String,
    createdAt: Date,
    updatedAt: String,
    fullyPaid: Boolean,
    unpaid:Boolean,
    currentSubtotalLineItemsQuantity: Number,
    subtotalLineItemsQuantity: Number,
    tags:[String], // verificare
    email: String,
    currentTotalWeight: String || Number,
    confirmed:Boolean,
    displayFulfillmentStatus: String,
    paymentGatewayNames:[ String || Object],
    shippingAddress:{
      address1: String,
      name: String,
      address2: String,
      city: String,
      company: String,
      country: String,
      firstName: String,
      lastName: String,
      latitude: Number,
      longitude: Number,
      phone: String,
      province: String,
      zip: String,
      __typename: String
    },
    totalPriceSet:{
      shopMoney:{
        amount: String,
        currencyCode: String,
        __typename: String
      },
      __typename: String
    },
    __typename: String},
    
}, { collection : 'samples' });

const Sample = mongoose.model('Sample', sampleSchema);

module.exports.Sample = Sample;