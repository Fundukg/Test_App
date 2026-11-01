import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  // Момент последней успешной загрузки данных.
  since: number;
  onRefresh: () => void;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since, onRefresh }: Props) {
  const [seconds, setSeconds] = useState(Date.now());
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
   const calculateDiff = () => {
      const diff = Math.floor((Date.now() - since) / 1000);
      setSeconds(diff >= 0 ? diff : 0);
    };
    calculateDiff();
    const interval = setInterval(calculateDiff, 1000);
    return () => clearInterval(interval);
  }, [since]);
  const handleRefresh = () => {
    setTrigger((prev) => !prev); // Увеличиваем счетчик, чтобы изменить зависимость
  };
  return (
    <View>
      <Text style={styles.text}>Обновлено {seconds} сек назад</Text>
      <Pressable onPress={onRefresh}>
        <Text>Обновить</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: "#6b7280",
  },
});
