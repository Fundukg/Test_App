import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useMatchesData } from "../hooks/useMatchesData";
import { FavoriteButton } from "../components/FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import { UpdatedAgo } from "../components/UpdatedAgo";
// Импортируйте FavoriteButton и UpdatedAgo из компонентов коллеги

type FilterType = "All" | "Upcoming" | "Finished" | "Live" | "Postponed";

export const MatchesScreen = () => {
  const { matches, isLoading, isRefreshing, error, lastUpdated, refetch } =
    useMatchesData();
  const { isFavorite, toggle } = useFavorites();
  const [filter, setFilter] = useState<FilterType>("All");
  const [isCancel, setIsCancel] = useState(false);
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (filter === "All") return true;
      if (filter === "Upcoming") return match.status === "scheduled";
      if (filter === "Finished") return match.status === "finished";
      if (filter === "Live") return match.status === "live";
      if (filter === "Postponed") return match.status === "postponed";
      return true;
    });
  }, [matches, filter]);

  if (isLoading && !isRefreshing) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }
  if (error && !isCancel) {
    return (
      <View style={styles.center}>
        <Text>Не удалось загрузить данные </Text>
        <Pressable onPress={refetch}>
          <Text>Повторить</Text>
        </Pressable>
        <Pressable onPress={() => setIsCancel(true)}>
          <Text>Вывести демо данные</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {(
          ["All", "Upcoming", "Finished", "Live", "Postponed"] as FilterType[]
        ).map((filters) => (
          <Pressable
            key={filters}
            style={[
              styles.filterChip,
              filter === filters && styles.filterChipActive,
            ]}
            onPress={() => setFilter(filters)}
          >
            <Text
              style={[
                styles.filterText,
                filter === filters && styles.filterTextActive,
              ]}
            >
              {filters === "All"
                ? "Все"
                : filters === "Live"
                  ? "В процессе"
                  : filters === "Upcoming"
                    ? "Предстоящие"
                    : filters === "Postponed"
                      ? "Отложенные"
                      : "Завершенные"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.updatedContainer}>
        <UpdatedAgo since={lastUpdated} onRefresh={refetch} />
      </View>

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Матчей не найдено</Text>
          </View>
        }
        contentContainerStyle={
          filteredMatches.length === 0 ? styles.emptyList : styles.list
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>
                {new Date(item.startsAt).toLocaleString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
              {/* Статус по-русски */}
              <Text style={styles.statusText}>
                {item.status === "scheduled"
                  ? "Предстоит"
                  : item.status === "finished"
                    ? "Завершен"
                    : item.status === "live"
                      ? "В прямом эфире"
                      : item.status === "postponed"
                        ? "Отложен"
                        : "Отменен"}
              </Text>
            </View>

            <View style={styles.matchRow}>
              <View style={styles.teamContainer}>
                <Text style={styles.teamText} numberOfLines={1}>
                  {item.home.name}
                </Text>
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {item.score !== null && item.score !== null
                    ? `${item.score.home} : ${item.score.away}`
                    : "- : -"}
                </Text>
              </View>

              <View style={styles.teamContainer}>
                <Text style={styles.teamText} numberOfLines={1}>
                  {item.away.name}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <FavoriteButton
                active={isFavorite(item.id)}
                onPress={() => toggle(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: { padding: 16, paddingBottom: 40 },
  emptyList: { flex: 1, justifyContent: "center" },

  // Фильтры
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  filterChipActive: { backgroundColor: "#007AFF" },
  filterText: { color: "#333", fontWeight: "500" },
  filterTextActive: { color: "#fff", fontWeight: "bold" },

  updatedContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: "flex-end",
  },

  // Карточка
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: { color: "#666", fontSize: 12 },
  statusText: { color: "#007AFF", fontSize: 12, fontWeight: "bold" },

  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamContainer: { flex: 1 },
  teamText: { fontSize: 16, fontWeight: "600" },
  scoreContainer: { paddingHorizontal: 16 },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },

  actions: { marginTop: 16, alignItems: "flex-end" },

  // Тексты и кнопки
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: { fontSize: 16, color: "#666" },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonTextSecondary: { color: "#007AFF", fontSize: 16 },
});
