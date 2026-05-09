import type { PropsWithChildren, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../ThemeProvider";
import { radii, spacing, type } from "../theme";

interface ScreenShellProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export function ScreenShell({ title, subtitle, eyebrow, children }: ScreenShellProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </ScrollView>
  );
}

export function Card({ children, tone = "default" }: PropsWithChildren<{ tone?: "default" | "dark" | "soft" }>) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  return <View style={[styles.card, tone === "dark" && styles.darkCard, tone === "soft" && styles.softCard]}>{children}</View>;
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: "green" | "blue" | "gold" }) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  return (
    <View
      style={[
        styles.metric,
        tone === "green" && styles.metricGreen,
        tone === "blue" && styles.metricBlue,
        tone === "gold" && styles.metricGold,
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

export function Pill({ children, selected = false, onPress }: PropsWithChildren<{ selected?: boolean; onPress?(): void }>) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  const content = <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{children}</Text>;

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && styles.buttonPressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.pill, selected && styles.pillSelected]}>{content}</View>;
}

export function ActionButton({
  title,
  onPress,
  variant = "primary",
}: {
  title: string;
  onPress(): void;
  variant?: "primary" | "secondary";
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

export function ListRow({
  title,
  detail,
  meta,
  marker,
}: {
  title: string;
  detail: string;
  meta?: string;
  marker?: ReactNode;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme.palette);
  return (
    <View style={styles.row}>
      <View style={styles.rowMarker}>{marker}</View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
    </View>
  );
}

export function createStyles(palette: typeof import("../theme").palette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: palette.background,
    },
    screenContent: {
      alignSelf: "center",
      gap: spacing.xl,
      maxWidth: 980,
      padding: spacing.xl,
      paddingBottom: 120,
      width: "100%",
    },
    header: {
      gap: spacing.sm,
      paddingTop: spacing.md,
    },
    eyebrow: {
      color: palette.accent,
      fontSize: type.label,
      fontWeight: "800",
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    title: {
      color: palette.ink,
      fontSize: type.hero,
      fontWeight: "800",
      lineHeight: 40,
    },
    subtitle: {
      color: palette.muted,
      fontSize: 16,
      lineHeight: 24,
      maxWidth: 620,
    },
    card: {
      backgroundColor: palette.surface,
      borderColor: palette.line,
      borderRadius: radii.lg,
      borderWidth: 1,
      elevation: 2,
      gap: spacing.lg,
      padding: spacing.xl,
      shadowColor: palette.ink,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
    darkCard: {
      backgroundColor: palette.primaryDark,
      borderColor: palette.primaryDark,
    },
    softCard: {
      backgroundColor: palette.surfaceAlt,
    },
    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sectionTitle: {
      color: palette.ink,
      fontSize: 18,
      fontWeight: "800",
    },
    sectionAction: {
      color: palette.primary,
      fontSize: 13,
      fontWeight: "800",
    },
    metric: {
      backgroundColor: palette.surface,
      borderColor: palette.line,
      borderRadius: radii.md,
      borderWidth: 1,
      flex: 1,
      minWidth: 148,
      padding: spacing.lg,
    },
    metricGreen: {
      backgroundColor: palette.greenSoft,
    },
    metricBlue: {
      backgroundColor: palette.blueSoft,
    },
    metricGold: {
      backgroundColor: palette.goldSoft,
    },
    metricLabel: {
      color: palette.muted,
      fontSize: type.label,
      fontWeight: "800",
      textTransform: "uppercase",
    },
    metricValue: {
      color: palette.ink,
      fontSize: 26,
      fontWeight: "800",
      marginTop: spacing.sm,
    },
    metricDetail: {
      color: palette.muted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing.xs,
    },
    pill: {
      borderColor: palette.line,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    pillSelected: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    pillText: {
      color: palette.muted,
      fontSize: 13,
      fontWeight: "700",
    },
    pillTextSelected: {
      color: palette.surface,
    },
    button: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: radii.md,
      justifyContent: "center",
      minHeight: 50,
      paddingHorizontal: spacing.lg,
    },
    secondaryButton: {
      backgroundColor: palette.surface,
      borderColor: palette.line,
      borderWidth: 1,
    },
    buttonPressed: {
      opacity: 0.78,
    },
    buttonText: {
      color: palette.surface,
      fontSize: type.body,
      fontWeight: "800",
    },
    secondaryButtonText: {
      color: palette.primary,
    },
    row: {
      alignItems: "center",
      borderTopColor: palette.line,
      borderTopWidth: 1,
      flexDirection: "row",
      gap: spacing.md,
      paddingTop: spacing.lg,
    },
    rowMarker: {
      alignItems: "center",
      backgroundColor: palette.accentSoft,
      borderRadius: radii.md,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    rowBody: {
      flex: 1,
      gap: spacing.xs,
    },
    rowTitle: {
      color: palette.ink,
      fontSize: type.body,
      fontWeight: "800",
    },
    rowDetail: {
      color: palette.muted,
      fontSize: 13,
      lineHeight: 18,
    },
    rowMeta: {
      color: palette.primary,
      fontSize: 13,
      fontWeight: "800",
    },
  });
}
