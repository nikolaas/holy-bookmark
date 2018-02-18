/**
 * Temporary fix for "Automatic enabling of cancellation of promises is deprecated" issue
 * @see https://github.com/yagop/node-telegram-bot-api/issues/319
 */
process.env["NTBA_FIX_319"] = 1;