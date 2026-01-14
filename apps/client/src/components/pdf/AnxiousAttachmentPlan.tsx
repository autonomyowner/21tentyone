'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Using built-in fonts for reliability
// Helvetica-Bold for headings, Helvetica for body

// T21 Color Palette
const colors = {
  primary: '#81352E',
  accent: '#BA5448',
  secondary: '#9D433A',
  cream50: '#FBE9E7',
  cream100: '#F5E0DB',
  cream200: '#EACCC6',
  cream300: '#E6C8C3',
  muted: '#A87A75',
  success: '#6B8E6B',
  warning: '#C45C4C',
  text: '#81352E',
  textLight: '#9D433A',
  white: '#FFFFFF',
};

// Styles - Using Helvetica (built-in)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    padding: 25,
    marginBottom: 20,
    marginHorizontal: -40,
    marginTop: -40,
  },
  headerBrand: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubBrand: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.cream100,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: colors.cream100,
    textAlign: 'center',
  },
  headerDate: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.cream200,
    textAlign: 'center',
    marginTop: 12,
  },

  // Info Box
  infoBox: {
    backgroundColor: colors.cream50,
    border: `1.5pt solid ${colors.cream200}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.primary,
  },
  infoValue: {
    fontSize: 9,
    color: colors.textLight,
  },

  // Boxes with colored headers
  box: {
    marginBottom: 15,
    borderRadius: 6,
    overflow: 'hidden',
  },
  boxHeader: {
    padding: 8,
    paddingHorizontal: 12,
  },
  boxHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: colors.white,
  },
  boxContent: {
    padding: 12,
  },

  goalBox: {
    backgroundColor: '#E8F5E8',
    border: `1.5pt solid ${colors.success}`,
  },
  goalBoxHeader: {
    backgroundColor: colors.success,
  },

  keyBox: {
    backgroundColor: colors.cream50,
    border: `1.5pt solid ${colors.accent}`,
  },
  keyBoxHeader: {
    backgroundColor: colors.accent,
  },

  warningBox: {
    backgroundColor: colors.cream100,
    border: `1.5pt solid ${colors.warning}`,
  },
  warningBoxHeader: {
    backgroundColor: colors.warning,
  },

  phaseBox: {
    backgroundColor: colors.white,
    border: `2pt solid ${colors.primary}`,
  },
  phaseBoxHeader: {
    backgroundColor: colors.primary,
  },

  dayBox: {
    backgroundColor: colors.cream50,
    border: `1pt solid ${colors.cream300}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dayBoxTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: colors.primary,
    marginBottom: 6,
    backgroundColor: colors.cream100,
    padding: 6,
    marginHorizontal: -10,
    marginTop: -10,
  },

  // Section Headers
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },

  subsectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: colors.secondary,
    marginTop: 12,
    marginBottom: 6,
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 5,
  },
  bullet: {
    width: 12,
    color: colors.primary,
  },
  listText: {
    flex: 1,
    fontSize: 9,
  },

  // Week divider
  weekDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cream200,
  },
  dividerText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: colors.primary,
    paddingHorizontal: 15,
  },

  // Tags
  interventionTag: {
    backgroundColor: colors.cream100,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 3,
  },
  interventionTagText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },

  // Table
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 8,
  },
  tableHeaderCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: colors.white,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.cream200,
  },
  tableRowAlt: {
    backgroundColor: colors.cream50,
  },
  tableCell: {
    fontSize: 8,
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: colors.muted,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 25,
    right: 40,
    fontSize: 8,
    color: colors.muted,
  },

  // Paragraph
  paragraph: {
    fontSize: 9,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },

  // Emergency box
  emergencyBox: {
    backgroundColor: colors.cream100,
    border: `2pt solid ${colors.warning}`,
    borderRadius: 6,
    padding: 15,
    marginVertical: 10,
  },
  emergencyTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: colors.warning,
    textAlign: 'center',
    marginBottom: 10,
  },
});

// Helper components
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

const InterventionTag = ({ text }: { text: string }) => (
  <View style={styles.interventionTag}>
    <Text style={styles.interventionTagText}>{text}</Text>
  </View>
);

const WeekDivider = ({ text }: { text: string }) => (
  <View style={styles.weekDivider}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{text}</Text>
    <View style={styles.dividerLine} />
  </View>
);

// Main Document
const AnxiousAttachmentPlan = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      {/* Page 1: Cover & Executive Summary */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>T21</Text>
          <Text style={styles.headerSubBrand}>ATTACHMENT HEALING PROGRAM</Text>
          <Text style={styles.headerTitle}>21-Day Anxious Attachment{'\n'}Treatment Plan</Text>
          <Text style={styles.headerSubtitle}>Clinician Guide | Intensive Healing Protocol</Text>
          <Text style={styles.headerDate}>{currentDate}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Program Type:</Text>
            <Text style={styles.infoValue}>Intensive Outpatient</Text>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>21 Days</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target Population:</Text>
            <Text style={styles.infoValue}>Adults with Anxious Attachment</Text>
            <Text style={styles.infoLabel}>Format:</Text>
            <Text style={styles.infoValue}>Daily Sessions</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Treatment Setting:</Text>
            <Text style={styles.infoValue}>Individual + Group</Text>
            <Text style={styles.infoLabel}>Evidence Base:</Text>
            <Text style={styles.infoValue}>AFT, EMDR, IFS, DBT</Text>
          </View>
        </View>

        <View style={[styles.box, styles.goalBox]}>
          <View style={[styles.boxHeader, styles.goalBoxHeader]}>
            <Text style={styles.boxHeaderText}>Primary Treatment Goals (SMART)</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Reduce ECR-R attachment anxiety subscale score by 50% within 21 days</ListItem>
            <ListItem>Develop and demonstrate 3 self-soothing techniques for abandonment triggers by Day 7</ListItem>
            <ListItem>Identify and cognitively restructure 5 core attachment beliefs by Day 14</ListItem>
            <ListItem>Establish and maintain daily secure self-attachment practices by Day 21</ListItem>
          </View>
        </View>

        <View style={[styles.box, styles.keyBox]}>
          <View style={[styles.boxHeader, styles.keyBoxHeader]}>
            <Text style={styles.boxHeaderText}>Core Therapeutic Modalities</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem><Text style={styles.bold}>Attachment-Focused Therapy (AFT):</Text> Primary framework for understanding and healing attachment wounds</ListItem>
            <ListItem><Text style={styles.bold}>EMDR:</Text> Processing early attachment trauma and relational injuries</ListItem>
            <ListItem><Text style={styles.bold}>Internal Family Systems (IFS):</Text> Working with protective parts and exiled attachment needs</ListItem>
            <ListItem><Text style={styles.bold}>Somatic Experiencing:</Text> Body-based regulation and nervous system healing</ListItem>
            <ListItem><Text style={styles.bold}>DBT Skills:</Text> Distress tolerance and emotional regulation techniques</ListItem>
          </View>
        </View>

        <View style={[styles.box, styles.warningBox]}>
          <View style={[styles.boxHeader, styles.warningBoxHeader]}>
            <Text style={styles.boxHeaderText}>Critical Assessment Points</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Screen for trauma history, complex PTSD, and personality disorders at intake</ListItem>
            <ListItem>Assess suicide/self-harm risk—anxious attachment correlates with increased risk</ListItem>
            <ListItem>Monitor for relationship crises during treatment (common trigger)</ListItem>
            <ListItem>Evaluate co-occurring conditions: depression, anxiety disorders, substance use</ListItem>
          </View>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 2: Clinical Overview */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>1. Clinical Overview: Anxious Attachment</Text>

        <Text style={styles.subsectionTitle}>Diagnostic Presentation</Text>
        <Text style={styles.paragraph}><Text style={styles.bold}>Core Features of Anxious Attachment Pattern:</Text></Text>
        <ListItem>Hyperactivation of attachment system in response to perceived threats</ListItem>
        <ListItem>Excessive proximity-seeking and reassurance-seeking behaviors</ListItem>
        <ListItem>Heightened vigilance to signs of rejection or abandonment</ListItem>
        <ListItem>Difficulty self-soothing without partner/attachment figure</ListItem>
        <ListItem>Tendency toward emotional dysregulation when attachment needs unmet</ListItem>
        <ListItem>Negative model of self, positive model of others ("I am unworthy, you can save me")</ListItem>

        <View style={[styles.box, styles.keyBox, { marginTop: 15 }]}>
          <View style={[styles.boxHeader, styles.keyBoxHeader]}>
            <Text style={styles.boxHeaderText}>Common Presenting Complaints</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>"I can&apos;t stop worrying that my partner will leave me"</ListItem>
            <ListItem>"I need constant reassurance that they still love me"</ListItem>
            <ListItem>"When they don&apos;t respond to my texts, I panic"</ListItem>
            <ListItem>"I know I&apos;m too needy but I can&apos;t help it"</ListItem>
            <ListItem>"I lose myself in relationships"</ListItem>
            <ListItem>"I feel empty and worthless when I&apos;m not in a relationship"</ListItem>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Assessment Battery</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Instrument</Text>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Purpose</Text>
            <Text style={styles.tableHeaderCell}>Timing</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>ECR-R</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Primary attachment style measure</Text>
            <Text style={styles.tableCell}>Days 1, 11, 21</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>PHQ-9</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Depression screening</Text>
            <Text style={styles.tableCell}>Days 1, 11, 21</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>GAD-7</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Anxiety screening</Text>
            <Text style={styles.tableCell}>Days 1, 11, 21</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>PCL-5</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>PTSD/trauma screening</Text>
            <Text style={styles.tableCell}>Day 1</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>DERS</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Emotional regulation assessment</Text>
            <Text style={styles.tableCell}>Days 1, 21</Text>
          </View>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 3: Treatment Framework */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>2. Treatment Framework</Text>

        <Text style={styles.paragraph}>This protocol integrates five evidence-based modalities:</Text>

        <View style={[styles.box, styles.phaseBox]}>
          <View style={[styles.boxHeader, styles.phaseBoxHeader]}>
            <Text style={styles.boxHeaderText}>Attachment-Focused Therapy (AFT) — Primary Framework</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Therapist as secure base for exploration</ListItem>
            <ListItem>Corrective emotional experiences within therapeutic relationship</ListItem>
            <ListItem>Making implicit attachment patterns explicit</ListItem>
            <ListItem>Developing earned secure attachment</ListItem>
          </View>
        </View>

        <View style={[styles.box, styles.phaseBox]}>
          <View style={[styles.boxHeader, styles.phaseBoxHeader]}>
            <Text style={styles.boxHeaderText}>EMDR for Attachment Wounds — Trauma Processing</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Process formative attachment memories (neglect, inconsistent caregiving)</ListItem>
            <ListItem>Desensitize triggers for abandonment fear</ListItem>
            <ListItem>Install positive cognitions about self-worth and lovability</ListItem>
            <ListItem>Resource development and installation before trauma processing</ListItem>
          </View>
        </View>

        <View style={[styles.box, styles.phaseBox]}>
          <View style={[styles.boxHeader, styles.phaseBoxHeader]}>
            <Text style={styles.boxHeaderText}>Internal Family Systems (IFS) — Parts Work</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Identify protective "manager" parts (people-pleasing, hypervigilance)</ListItem>
            <ListItem>Access "firefighter" parts (protest behaviors, panic responses)</ListItem>
            <ListItem>Unburden "exile" parts carrying attachment wounds</ListItem>
            <ListItem>Strengthen Self-energy and self-leadership</ListItem>
          </View>
        </View>

        <View style={[styles.box, styles.phaseBox]}>
          <View style={[styles.boxHeader, styles.phaseBoxHeader]}>
            <Text style={styles.boxHeaderText}>DBT Skills — Skill Building</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem><Text style={styles.bold}>Distress Tolerance:</Text> TIPP, STOP, radical acceptance</ListItem>
            <ListItem><Text style={styles.bold}>Emotion Regulation:</Text> Opposite action, checking the facts</ListItem>
            <ListItem><Text style={styles.bold}>Interpersonal Effectiveness:</Text> DEAR MAN, GIVE, FAST</ListItem>
            <ListItem><Text style={styles.bold}>Mindfulness:</Text> Present-moment awareness, non-judgment</ListItem>
          </View>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 4: Week 1 Protocol */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>3. 21-Day Treatment Protocol</Text>

        <WeekDivider text="WEEK 1: FOUNDATION & STABILIZATION (Days 1-7)" />

        <View style={[styles.box, styles.goalBox]}>
          <View style={[styles.boxHeader, styles.goalBoxHeader]}>
            <Text style={styles.boxHeaderText}>Week 1 Goals</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Establish therapeutic alliance and secure base</ListItem>
            <ListItem>Complete comprehensive attachment assessment</ListItem>
            <ListItem>Psychoeducation on attachment theory and patterns</ListItem>
            <ListItem>Develop initial self-soothing toolkit (3 techniques)</ListItem>
            <ListItem>Begin nervous system regulation work</ListItem>
          </View>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 1 — Intake & Assessment (90 min)</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Objectives:</Text> Establish therapeutic frame and safety, complete attachment history intake, administer baseline assessments (ECR-R, PHQ-9, GAD-7, DERS, PCL-5), discuss treatment goals.</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="AFT" />
            <InterventionTag text="IFS" />
            <InterventionTag text="Somatic" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Homework:</Text> Attachment timeline exercise, daily mood tracking, identify 3 activating situations.</Text>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 2 — Understanding Anxious Attachment (60 min)</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Key Teaching:</Text> Attachment as survival mechanism, hyperactivation strategy, neurobiological basis, earned secure attachment concept.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Homework:</Text> Read handout, identify 5 anxiety-driven behaviors, notice protest behaviors.</Text>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 3 — Body-Based Awareness (60 min)</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="Somatic" />
            <InterventionTag text="DBT" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Focus:</Text> Interoceptive awareness, somatic signatures of attachment anxiety, grounding techniques, body-based resources. Introduce TIPP skills.</Text>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 4 — Meeting the Parts (60 min)</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="IFS" />
            <InterventionTag text="AFT" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Common Parts:</Text> The Worrier, People-Pleaser, Clingy Part, Protester, Abandoned Child (Exile).</Text>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 5: Week 1 continued + Week 2 */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 5 — Building the Self-Soothing Toolkit (60 min)</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Techniques Menu:</Text></Text>
          <ListItem>Bilateral Self-Hug: Cross arms, tap alternately, breathe</ListItem>
          <ListItem>Safe Place Visualization: Detailed imaginal resource</ListItem>
          <ListItem>Vagal Toning: Cold water, humming, slow exhale</ListItem>
          <ListItem>Grounding 5-4-3-2-1: Sensory anchoring to present</ListItem>
          <ListItem>Comfort Object: Transitional object for soothing</ListItem>
          <ListItem>Self-Compassion Phrases: "I am here for myself"</ListItem>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Days 6-7 — DBT Skills & Week 1 Integration</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="DBT" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 6:</Text> Check the Facts, Opposite Action, STOP Skill, Radical Acceptance.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 7:</Text> Review Week 1, demo 3 self-soothing techniques (Goal Check), prepare for trauma work.</Text>
        </View>

        <WeekDivider text="WEEK 2: PROCESSING & RESTRUCTURING (Days 8-14)" />

        <View style={[styles.box, styles.goalBox]}>
          <View style={[styles.boxHeader, styles.goalBoxHeader]}>
            <Text style={styles.boxHeaderText}>Week 2 Goals</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Begin EMDR processing of attachment wounds</ListItem>
            <ListItem>Identify and challenge 5 core attachment beliefs</ListItem>
            <ListItem>Deepen IFS work—access and unburden exiles</ListItem>
            <ListItem>Develop new internal working models</ListItem>
            <ListItem>Build capacity to tolerate relationship uncertainty</ListItem>
          </View>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 8 — Core Beliefs Mapping (60 min)</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Common Anxious Beliefs:</Text></Text>
          <ListItem><Text style={styles.bold}>About Self:</Text> "I am unlovable," "I am too much," "I am not enough"</ListItem>
          <ListItem><Text style={styles.bold}>About Others:</Text> "People will leave," "I must work hard for love"</ListItem>
          <ListItem><Text style={styles.bold}>About Relationships:</Text> "Love is scarce," "Conflict means abandonment"</ListItem>
          <Text style={styles.paragraph}><Text style={styles.bold}>Target Cognitions:</Text> "I am worthy of love as I am," "I can trust myself," "My needs matter," "I am enough"</Text>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Days 9-10 — EMDR Processing (90 min each)</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="EMDR" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Targets:</Text> Earliest abandonment memory, key childhood rejection, inconsistent caregiving, first romantic rejection, current triggers.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Protocol Modifications:</Text> Extended resourcing, attachment figure interweaves, slow pacing, frequent grounding.</Text>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 6: Week 2 continued + Week 3 */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Days 11-14 — IFS Deep Work, Cognitive Restructuring, Relational Patterns</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 11:</Text> IFS exile unburdening, mid-point assessments (ECR-R, PHQ-9, GAD-7).</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 12:</Text> Systematic cognitive restructuring of 5 core beliefs.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 13:</Text> Map relational cycles, identify intervention points, practice new responses.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 14:</Text> Week 2 integration, present 5 restructured beliefs (Goal Check).</Text>
        </View>

        <WeekDivider text="WEEK 3: INTEGRATION & SUSTAINABILITY (Days 15-21)" />

        <View style={[styles.box, styles.goalBox]}>
          <View style={[styles.boxHeader, styles.goalBoxHeader]}>
            <Text style={styles.boxHeaderText}>Week 3 Goals</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Establish daily secure self-attachment practices</ListItem>
            <ListItem>Apply skills to real-world relationship scenarios</ListItem>
            <ListItem>Build sustainable self-regulation capacity</ListItem>
            <ListItem>Develop relapse prevention plan</ListItem>
            <ListItem>Achieve 50% reduction in ECR-R attachment anxiety score</ListItem>
          </View>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Day 15 — Becoming Your Own Secure Base (60 min)</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Secure Self-Attachment Practices:</Text></Text>
          <ListItem>Morning Grounding Ritual: "I am here for myself today"</ListItem>
          <ListItem>Self-Validation Practice: Acknowledge feelings without external confirmation</ListItem>
          <ListItem>Inner Reparenting: Dialogue with younger self</ListItem>
          <ListItem>Evening Integration: Review day, celebrate showing up for self</ListItem>
          <ListItem>Secure Base Visualization: Internal safe figure always available</ListItem>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Days 16-17 — Interpersonal Skills & Behavioral Experiments</Text>
          <View style={styles.tagRow}>
            <InterventionTag text="DBT" />
          </View>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 16:</Text> DEAR MAN, GIVE, FAST skills. Practice assertive communication and boundary-setting.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 17:</Text> Design and conduct behavioral experiments to test new beliefs in relationships.</Text>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.dayBoxTitle}>Days 18-21 — Relapse Prevention, Integration & Completion</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 18:</Text> Identify warning signs, develop coping plan, establish support structure.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 19:</Text> Integrated response practice—role-play triggering scenarios.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 20:</Text> Future self visualization and resource installation.</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Day 21:</Text> Final assessments, goal review, aftercare planning, closing celebration.</Text>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 7: Monitoring & Crisis */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>4. Monitoring and Expected Outcomes</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Measure</Text>
            <Text style={styles.tableHeaderCell}>Day 1</Text>
            <Text style={styles.tableHeaderCell}>Day 11</Text>
            <Text style={styles.tableHeaderCell}>Day 21</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Target</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>ECR-R Anxiety</Text>
            <Text style={styles.tableCell}>Baseline</Text>
            <Text style={styles.tableCell}>Check</Text>
            <Text style={styles.tableCell}>Final</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>50% reduction</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>PHQ-9</Text>
            <Text style={styles.tableCell}>Baseline</Text>
            <Text style={styles.tableCell}>Check</Text>
            <Text style={styles.tableCell}>Final</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Score &lt;10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>GAD-7</Text>
            <Text style={styles.tableCell}>Baseline</Text>
            <Text style={styles.tableCell}>Check</Text>
            <Text style={styles.tableCell}>Final</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Score &lt;8</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Self-Soothing Skills</Text>
            <Text style={styles.tableCell}>0/3</Text>
            <Text style={styles.tableCell}>—</Text>
            <Text style={styles.tableCell}>3/3</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>3 mastered</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Core Beliefs Restructured</Text>
            <Text style={styles.tableCell}>0/5</Text>
            <Text style={styles.tableCell}>—</Text>
            <Text style={styles.tableCell}>5/5</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>5 challenged</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>5. Crisis Management</Text>

        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyTitle}>CRISIS RESOURCES</Text>
          <ListItem><Text style={styles.bold}>988 Suicide & Crisis Lifeline:</Text> Call or text 988</ListItem>
          <ListItem><Text style={styles.bold}>Crisis Text Line:</Text> Text HOME to 741741</ListItem>
          <ListItem><Text style={styles.bold}>International:</Text> https://www.iasp.info/resources/Crisis_Centres/</ListItem>
        </View>

        <View style={[styles.box, styles.warningBox]}>
          <View style={[styles.boxHeader, styles.warningBoxHeader]}>
            <Text style={styles.boxHeaderText}>Monitor Closely During:</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem>Relationship conflicts or breakups</ListItem>
            <ListItem>Partner unavailability (travel, busy periods)</ListItem>
            <ListItem>Major life transitions</ListItem>
            <ListItem>Days 9-10 during EMDR processing</ListItem>
            <ListItem>Program completion (fear of losing therapeutic attachment)</ListItem>
          </View>
        </View>

        <Text style={styles.sectionTitle}>6. Clinical Notes for Providers</Text>

        <View style={[styles.box, styles.keyBox]}>
          <View style={[styles.boxHeader, styles.keyBoxHeader]}>
            <Text style={styles.boxHeaderText}>Therapeutic Stance</Text>
          </View>
          <View style={styles.boxContent}>
            <ListItem><Text style={styles.bold}>Be the secure base:</Text> Consistent, reliable, attuned presence</ListItem>
            <ListItem><Text style={styles.bold}>Model rupture and repair:</Text> Demonstrate connection survives conflict</ListItem>
            <ListItem><Text style={styles.bold}>Avoid reinforcing reassurance-seeking:</Text> Validate feelings, not catastrophic interpretations</ListItem>
            <ListItem><Text style={styles.bold}>Name the pattern, not the person:</Text> "Your anxiety is showing up" vs. "You're being anxious"</ListItem>
            <ListItem><Text style={styles.bold}>Expect transference:</Text> Patient may replicate pattern with therapist</ListItem>
          </View>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>

      {/* Page 8: Aftercare & Signature */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>7. Aftercare Recommendations</Text>

        <ListItem>Weekly/biweekly individual therapy (maintenance phase)</ListItem>
        <ListItem>Attachment-focused support group</ListItem>
        <ListItem>Monthly booster sessions for 3 months</ListItem>
        <ListItem>Daily secure self-attachment practice</ListItem>
        <ListItem>Continued skill practice and behavioral experiments</ListItem>

        <Text style={styles.subsectionTitle}>Contraindications</Text>
        <Text style={styles.paragraph}><Text style={styles.bold}>Screen Out or Modify Protocol For:</Text></Text>
        <ListItem>Active suicidal ideation with plan/intent (stabilize first)</ListItem>
        <ListItem>Active substance use disorder (treat concurrently or first)</ListItem>
        <ListItem>Acute psychosis or severe dissociation</ListItem>
        <ListItem>Severe personality pathology requiring longer-term treatment</ListItem>
        <ListItem>Current abusive relationship (safety planning priority)</ListItem>

        <Text style={styles.sectionTitle}>8. Attestation</Text>

        <View style={{ marginTop: 30, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Text style={{ width: 140, fontFamily: 'Helvetica-Bold' }}>Treating Clinician:</Text>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: colors.muted }} />
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Text style={{ width: 140, fontFamily: 'Helvetica-Bold' }}>Credentials:</Text>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: colors.muted }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 140, fontFamily: 'Helvetica-Bold' }}>Date:</Text>
            <View style={{ width: 200, borderBottomWidth: 0.5, borderBottomColor: colors.muted }} />
          </View>
        </View>

        <View style={{
          backgroundColor: colors.cream50,
          border: `1pt solid ${colors.primary}`,
          borderRadius: 6,
          padding: 20,
          marginTop: 40,
          alignItems: 'center',
        }}>
          <Text style={{
            fontFamily: 'Helvetica-Bold',
            fontWeight: 700,
            fontSize: 12,
            color: colors.primary,
            marginBottom: 8,
          }}>T21 Attachment Healing Program</Text>
          <Text style={{
            fontSize: 8,
            color: colors.muted,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            This treatment plan is designed for use by licensed mental health professionals.{'\n'}
            Evidence-based interventions adapted for intensive 21-day format.
          </Text>
        </View>

        <Text style={styles.footer}>T21 Attachment Healing Program | Clinician Guide</Text>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
      </Page>
    </Document>
  );
};

export default AnxiousAttachmentPlan;
