const MODEL = 'facebook/bart-large-mnli';
const CATEGORY_LABEL_MAP = {
  'Takes less than 1 minute': '<1m',
  'Takes about 5 minutes': '5m',
  'Takes about 15 minutes': '15m',
  'Takes about 30 minutes': '30m',
  'Takes more than 1 hour': '1h<'
};
const TIME_CATEGORY_CLASSES = Object.keys(CATEGORY_LABEL_MAP);
const MAX_THREADS = 10;

function main() {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('HUGGINGFACE_API_KEY');
  if (!apiKey) {
    throw new Error('API key is not set in Script Properties.');
  }

  const threads = GmailApp.getInboxThreads(0, MAX_THREADS);

  for (const thread of threads) {
    const threadId = thread.getId();
    if (props.getProperty(threadId)) continue;

    const messageBody = thread.getMessages()[0].getPlainBody().substring(0, 1000) || '';
    const premise = `How long will it take to complete this task: ${messageBody}`;
    const longCategory = classifyWithHuggingFace(premise, TIME_CATEGORY_CLASSES, apiKey);
    const shortLabel = CATEGORY_LABEL_MAP[longCategory] || '';

    applyLabelToThread(thread, shortLabel);
    props.setProperty(threadId, 'true');
  }
}

function classifyWithHuggingFace(text, labels, apiKey) {
  const url = `https://api-inference.huggingface.co/models/${MODEL}`;
  const payload = {
    inputs: text,
    parameters: {
      candidate_labels: labels
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.error || !result.labels || result.labels.length === 0) {
    console.error("API Error or no labels:", result.error || result);
    return 'Error';
  }

  return result.labels[0];
}

function applyLabelToThread(thread, labelName) {
  const label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
  thread.addLabel(label);
}

// Manual Reset
function resetProcessedThreads() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  for (const key in allProps) {
    if (key.startsWith('thread_')) {
      props.deleteProperty(key);
    }
  }

  Logger.log("Processed thread memory cleared.");
}