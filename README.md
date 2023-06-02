# bitsend
Open-source remittance to and within Africa using Bitcoin and Lightning
## Video demo
👉🏾https://www.youtube.com/watch?v=D29JS4pztRo

## Introduction

Due to regulatory reasons, Bitcoin trading in Nigeria is currently considered illegal, nonetheless, there is still a huge adoption of Bitcoin as a means of exchange of value and not only as a source of value. There is also a huge market demand for remittance and foreign payments being received from Nigerians/Africans in diaspora and Bitcoin has the potential to fulfill this demand. 

With BitSend, Nigerians (and soon Africans) can seamlessly receive international payments paid directly to their bank account within minutes, leveraging the Lightning Network. 

## Breakdown of the Flow
As Africa currently has a low population of technically-savvy people who know how to use and interact with Bitcoin and Lightning Network, the scalability of this project depends on enabling a system where non-technical people are able to receive payments via Lightning and Bitcoin.


### Flow for Sender:
- The sender of the payment would be a bit technical person, so they would need to have some understanding of how to pay a lightning invoice, have a Lightning wallet e.t.c
- As the sender, they can connect to BitSend using their Lightning Wallet or using email and password
- The sender can put in the details of how much they want to pay (in the local currency of the recipient) and enter details of the recipient - the recipient’s email and bank account details.
- The sender can then settle the equivalent value of the payment amount in sats by scanning the lightning invoice with their wallet (which was used to connect to BitSend) or by copying the Lightning invoice.
- Once the payment is settled, the sender would see a success screen stating that payment has been sent to the recipient. 
- The sender would also be able to print a receipt as proof of payment sent to recipient
- The fiat settling of the payment is mostly supposed to be in a P2P format such that the invoice paid by the sender is that of a tech-savvy user who is based in the country the sender wants to send money to. Once the tech-savvy user receives the payment, then they can transfer funds from their local bank account to that of the recipient. But all of these would be mocked for the sake of this MVP. 

### Flow for Recipient
- The recipient is presumably someone who is not as tech-savvy as the sender. 
- The recipient would send their local bank account details to the sender.
- Once the Lightning Invoice is settled, the recipient would receive an email notification stating that a payment has been sent to them through BitSend. 
- Leveraging the pseudonymity of Bitcoin, the recipient would only have the details of the Lightning public key of the sender and not their real name. 
- The sender can send the receipt of payment printed as proof to the recipient
- Recipient does not need to have an account on Bitsend or interact with Lightning/Bitcoin


## APIs
- [x] /login-lnurlauth - to enable the user connect to BitSend with their Lightning wallet
- [x] /fetch-countries - to fetch the countries that are supported to receive payments with BitSend
- [x] /fetch-banks  - to fetch the banks in each country supported to receive payment with BitSend
- [x] /resolve-bank -  to fetch a receiver’s bank name from their bank and account number to confirm if the bank and account number match and are correct
- [x] /generate-invoice -to generate a new invoice for the payment session
- [x] /subscribe-invoice - to check the status of the paymentHash and confirm if it has been settled or not


## Technologies
- Frontend - ReactJs, socket.io, UsdToSats converter, Material UI
- Backend - Nodejs (Typescript), Socket.io,@radar/lnrpc, Nodemailer, PostgresQL

