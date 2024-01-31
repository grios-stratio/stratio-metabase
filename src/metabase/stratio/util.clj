(ns metabase.stratio.util
  (:require [clojure.string :as str]))


(defn make-vector
  [comma-separated-values]
  (if (empty? comma-separated-values)
    []
    (->> comma-separated-values
         (#(str/split % #","))
         (mapv str/trim)
         (filterv #(not (empty? %))))))


(defn ensure-vector
  [string-or-coll]
  (if (instance? java.lang.String string-or-coll)
    (make-vector string-or-coll)
    (vec string-or-coll)))


(defn stack-trace [e]
  (with-out-str (clojure.stacktrace/print-stack-trace e)))
