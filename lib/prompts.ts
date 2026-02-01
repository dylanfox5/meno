export const journalPrompts = {
  life: [
    "How is God most glorified in your life right now?",
    "Where are you finding your joy—in God Himself or in His gifts?",
    "What idol is competing with God for the supreme place in your affections?",
    "How has God's sovereign purpose been evident in your circumstances today?",
    "In what way is God calling you to make much of Him in this season?",
    "Where is God inviting you to treasure Christ above all earthly things?",
    "What temporal pleasure are you tempted to prefer over eternal joy in God?",
    "How might your current suffering be a means of grace to know God more deeply?",
    "What does it look like for you to delight in God rather than merely use Him?",
    "Where do you see God's lavish grace toward you as an undeserving sinner?",
    "How can you leverage your resources and gifts for God's global glory?",
    "What would it mean to live with a wartime mentality for the sake of the Kingdom?",
    "How is God sanctifying you through your present trials?",
    "Where are you being called to die to self for the supremacy of Christ?",
    "What would radical, risk-taking obedience look like in your situation?",
  ],
  scripture: [
    "How does this text magnify the glory and supremacy of God?",
    "What does this passage reveal about God's passion for His own glory?",
    "How does this text expose the deceitfulness of sin in your heart?",
    "What does this passage teach about the ultimate purpose of all things—God's glory?",
    "How does this text call you to find your deepest satisfaction in God alone?",
    "Where in this passage do you see God's sovereign grace at work?",
    "How does this scripture help you treasure Christ above all else?",
    "What does this text reveal about the seriousness of glorifying God?",
    "How does this passage challenge the idols of comfort and security in your life?",
    "What does it mean to obey this text in a way that makes much of God?",
    "How does this scripture point to the finished work of Christ on the cross?",
    "What does this passage teach about living for God's glory among the nations?",
    "How does this text expose your need for God's empowering grace?",
    "In what way does this scripture call you to a radical, God-exalting faith?",
    "How does this passage intensify your longing for the fullness of joy in God's presence?",
  ],
};

export function getRandomPrompt(type: "Life" | "Scripture"): string {
  const prompts =
    type === "Scripture" ? journalPrompts.scripture : journalPrompts.life;
  return prompts[Math.floor(Math.random() * prompts.length)];
}
