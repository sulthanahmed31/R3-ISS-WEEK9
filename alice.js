const crypto = require("crypto");

const alicePrivateKeyString = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKCalsCSaSyw6Z
hcO6o0mfW9AjwVMHByBfraIR2IDvIDCRSlJYf+ad7EFegig+JyDFzjlkz9Hv9Xlj
u+m0QVYTdOIwNrA+sT3Pe4liBdw9zD13VSHuxYTEoPUEx09TKLoAjF0TeLdQPSKN
e92hLr/iFzI33iSqAYDO+pViyXYMXM2BC9Hmimop6ny2IZe7j0mEzOm/vk95NZiV
qcS0Y/UfGJ28XE5Lu45X/grbEGkeqBnpMkO0onTiiQI0h18hv+CwhFyjxactmGyq
QEbrgIf8X23To9LuJBt3I1C+5RvIp4G1K0Si895zyCyYRPwshWWO9Dyt6ddDotER
SU5BBq4/AgMBAAECggEADHAE1IhJrh6/Atd3wa0csqlBynmzxUp8hTdYs1WLNm1a
YA9du2IATfeF3K4RkSXygAregKTEjUuk0e13CSg+hssaw5ISToG1xuiZgAXRVaKV
pBuDD8JsFni8LLOiYAGxVahOcIztaAyjbGdUMQCCQoZgCo1r32VhSxylBqRVVpRh
9iukeUOtJRzGAbF8bf42UWvVPgar+vaGPW+GvuWk9sWfLdURmV2RxFxqX9oWI03C
0KXOEf6KHeNc7AwR02x4b1GRX1sFs9XrxCuNWAw6wkcDUbnjG7YDe/83uAcxNcKZ
aEK9FbNeqmqO3mGq1lXX7Exvud3C88nmfJiLm1JJbQKBgQDopPo3j2WIn7UTinrX
6y7qaTUyIop4uHGpPBG2zzOV74ZmVexmm1t4ya5mwrby+QN/kKpbIJ+98+2IPYiY
kRbXTYwqwlqYRIEtBqNqjU8SM27NrlCcqQi00h/FNW4/rCqnfMt8lriWjFN6YJDO
SVfXOR8O6hxrpSOGvApvFoHk7QKBgQDeUhWPPfm9KcQDZPs6kIi1LEVon9dbK5Z1
TRvNZoM32bbU7KfXzFjn17bdFyV2cIYK+u42UgtmisQI5dTvxy3aKNCetPHL4bjz
jbOLVR1ju3BhqVNJNFDpMqjDIz9jFAdkDGRkPZGmBKFA7TVCioXlw51m+uFTByv9
vuyPipfGWwKBgQCSX4qW/n/xkBqL6usTgwOHtR4lJxpcjh/lTMgQbxmT0pqLNLCC
dmj8/Ffgi84z3XzX/BtTLpmTGDBxMdYJt+/ZEw+Hr7T0bNWhkLWsyq/fUcD7ZBuQ
FcJGkpYurElrglVr/9a/0szc2/mB29QAFqFP5r6l0aKED+jkUtd1wYGEmQKBgBL1
oxsNKQAl0K6NbRNoghAZT24Fu6Lty64DPmy84lHgAkSUThgMOETFU7X1JF++ZuAG
2EvPoWNEUEWF/Cvaq6FgO7JdMgW2IUS7/+TRBGmd8Y6SlyS2DnRkupmxptU3Pw4c
NG+MBKDI4kucLx+WmqamkQTYPmELSoggQSJYqmrjAoGAcKfUR+oWS3XUiHqGMjQj
9OWA8bLjuXNRFXnXmY5OaQ/bV+udsOmHPAyQf+fOnf3pxjv2KQhEh9XXPwoYt6sZ
0hG7Qha1hYcrfM4JaVBlEyl293HahQb2uNYGpGPAHBBaPC3PtoOLkM99C3mi6tJs
H6uAKsrn4RiX6rEROmazA5A=
-----END PRIVATE KEY-----`;
const alicePublicKeyString = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAygmpbAkmkssOmYXDuqNJ
n1vQI8FTBwcgX62iEdiA7yAwkUpSWH/mnexBXoIoPicgxc45ZM/R7/V5Y7vptEFW
E3TiMDawPrE9z3uJYgXcPcw9d1Uh7sWExKD1BMdPUyi6AIxdE3i3UD0ijXvdoS6/
4hcyN94kqgGAzvqVYsl2DFzNgQvR5opqKep8tiGXu49JhMzpv75PeTWYlanEtGP1
HxidvFxOS7uOV/4K2xBpHqgZ6TJDtKJ04okCNIdfIb/gsIRco8WnLZhsqkBG64CH
/F9t06PS7iQbdyNQvuUbyKeBtStEovPec8gsmET8LIVljvQ8renXQ6LREUlOQQau
PwIDAQAB
-----END PUBLIC KEY-----`;
const bobPublicKeyString = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyYQT9eXWWqtUsyWAhWBx
5P22t0H2nrmPAmQaU8t6ckQ1L8H8r+xAj67xVF/5x8N24xw8uMYApsfgR+yg9kJI
ejrfvYkIVe9zbuQS12TkUiQZTdayAy2zPQnGz5BPGDlDsRBc1M/6uTxVEC81yEJR
SryhdRcnM/phFa3DydrRfcma4sh29ApwmzKrweXyH7B2mF4FBmpzyl09h8w05Uvc
CTIocoubglyN3kum+6JQ2d/QbQPYtn723LivjtDajjLR3XBqvblfVLBXUHBMGaRI
2Zk9jDDQTh77EUsishjHJZczhFfHI8EDEG1bzBIM1roZ3mtPlJ/PqhbJ6YZSiuj/
rQIDAQAB
-----END PUBLIC KEY-----`;

const alicePrivateKey = crypto.createPrivateKey(alicePrivateKeyString);
const bobPublicKey = crypto.createPublicKey(bobPublicKeyString);
const alicePublicKey = crypto.createPublicKey(alicePublicKeyString);

const message = "I want some apples";
console.log("Message:", message);

const data = Buffer.from(message);
const signature = crypto.sign("sha256", data, alicePrivateKey);
console.log("Signature:", signature.toString("hex"));

const ciphertext = crypto.publicEncrypt(bobPublicKey, data);
console.log("Ciphertext:", ciphertext.toString("hex"));