function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function generateTopicSummary(topic) {
  const cleanTopic = topic.trim();

  if (!cleanTopic) {
    throw new Error('Enter a topic to generate a summary.');
  }

  await wait(800);

  return `This is a generated summary for ${cleanTopic}. Review the key definition, the major ideas, one practical example, and the most common mistakes so the topic is easier to revise later.`;
}

