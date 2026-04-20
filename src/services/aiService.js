function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const definitionTemplates = [
  (topic) => `${topic} is a study concept that explains how the main idea, structure, and purpose of the topic work together in practice.`,
  (topic) => `${topic} refers to a core academic idea that helps you understand how a system, event, or method behaves under specific conditions.`,
  (topic) => `${topic} is best understood as a topic that connects theory with application, showing why the concept matters beyond memorizing the name.`,
];

const keyPointTemplates = [
  (topic) => `Start by identifying the central rule or principle behind ${topic}; most exam questions test whether you understand that foundation first.`,
  (topic) => `Break ${topic} into smaller parts or stages so you can explain the flow instead of only recalling isolated facts.`,
  (topic) => `Pay attention to how ${topic} behaves in real scenarios, especially what changes when inputs, conditions, or assumptions change.`,
  (topic) => `Link ${topic} to related concepts you already know, because comparison usually makes the differences and strengths clearer.`,
  (topic) => `Focus on the vocabulary used in ${topic}; precise terms often signal the exact mechanism or meaning you are expected to recall.`,
  (topic) => `When revising ${topic}, ask what causes it, what it produces, and what limits or exceptions apply.`,
];

const exampleTemplates = [
  (topic) => `Example: if you were teaching ${topic} to a classmate, you would explain the core idea first, then walk through one concrete scenario where it clearly applies.`,
  (topic) => `Example: a typical problem on ${topic} might ask you to analyze a situation, identify the governing idea, and justify why that interpretation is correct.`,
  (topic) => `Example: in a real study setting, you could use ${topic} by taking one simple case, labeling each step, and checking how the outcome follows from the concept.`,
];

const mistakeTemplates = [
  (topic) => `Common mistake: treating ${topic} as a definition to memorize without understanding how or when it should be applied.`,
  (topic) => `Common mistake: mixing ${topic} up with a related idea and missing the condition that makes this topic distinct.`,
  (topic) => `Common mistake: skipping the underlying logic of ${topic} and jumping straight to the final answer or formula.`,
];

function pickTemplate(templates, seed, offset = 0) {
  const index = (seed + offset) % templates.length;
  return templates[index];
}

function buildSeed(topic) {
  return Array.from(topic).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function buildKeyPoints(topic, seed) {
  const selected = [];
  let offset = 0;

  while (selected.length < 4 && offset < keyPointTemplates.length * 2) {
    const candidate = pickTemplate(keyPointTemplates, seed, offset)(topic);

    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }

    offset += 1;
  }

  return selected.slice(0, 4);
}

export async function generateTopicSummary(topic) {
  const cleanTopic = topic.trim();

  if (!cleanTopic) {
    throw new Error('Enter a topic to generate a summary.');
  }

  await wait(800);

  const seed = buildSeed(cleanTopic.toLowerCase());
  const definition = pickTemplate(definitionTemplates, seed)(cleanTopic);
  const keyPoints = buildKeyPoints(cleanTopic, seed);
  const example = pickTemplate(exampleTemplates, seed, 1)(cleanTopic);
  const mistake = pickTemplate(mistakeTemplates, seed, 2)(cleanTopic);

  return [
    `Topic: ${cleanTopic}`,
    '',
    `Definition: ${definition}`,
    '',
    'Key Points:',
    ...keyPoints.map((point, index) => `${index + 1}. ${point}`),
    '',
    example,
    '',
    mistake,
  ].join('\n');
}
