function setupPopSizeListener(width, height, element) {
}
setupPopSizeListener(750, 600, document.getElementById("settings-popup"));
  
  function set_theme(theme_name) {
    _jm.set_theme(theme_name);
  }


  function getValueOrDefault(obj, key, defaultValue) {
    if (!obj.hasOwnProperty(key)) {
      return defaultValue;
    }
    return obj[key];
  }

  function openSettingsPopup() {
    document.getElementById("settings-popup").classList.remove("hidden");
  }

  function closeSettingsPopup() {
    console.log("close");
    document.getElementById("settings-popup").classList.add("hidden");
    autoSaveData();
  }
  function recordSettings(data) {
    console.log(data);
    // Obtener los valores de los campos del formulario.
    data["child-node-suggestion"] = document.getElementById(
      "child-node-suggestion"
    ).value;
    data["discuss-node-prompt"] = document.getElementById(
      "discuss-node-prompt"
    ).value;
    data["prefix-prompt"] = document.getElementById("prefix-prompt").value;
    data["restructure-prompt"] = document.getElementById("restructure-prompt").value;
    data["gpt-engine"] = document.getElementById("gpt-engine").value;
    data["token-usage"] = document.getElementById("token-usage").textContent;
    data["temperature"] = document.getElementById("temperature").value;
    console.log("recordSettings", data);
  }

  function addTokenUsage(tokens) {
      value = document.getElementById("token-usage").textContent;
      if (value == "" || isNaN(parseInt(value))) {
	  count = 0;
      } else {
	  count = parseInt(value);
      }
      console.log("addTokenUsage", value, count, tokens, count+tokens);
      document.getElementById("token-usage").textContent = (count + tokens).toString();
  }
  
  function saveSettings(event) {
    if (event) event.preventDefault();
    closeSettingsPopup();
  }

  // Adjunte el detector de eventos al formulario
  document
    .getElementById("settings-form")
    .addEventListener("submit", saveSettings);

  function load_meta_properties(options) {
    document.getElementById("token-usage").textContent = getValueOrDefault(
	options, "token-usage", (0).toString())
    document.getElementById("discuss-node-prompt").value = getValueOrDefault(
      options,
      "discuss-node-prompt",
      "Estoy creando un mapa de afinidad. Esto es lo que está actualmente visible en el mapa de afinidad:\n" +
        "${hyphenated_list}\n" +
        "Me gustaría hablar con usted sobre el '${text_of_node}' nodo, teniendo en cuenta el uso del framewor lean Startup.\n" +
        "Responde con tus pensamientos sobre:\n" +
        "1. Qué significa este nodo, tanto específica generalmente\n" +
        "2. La relevancia de este nodo, cómo contribuye individual y holísticamente\n" +
        "3. Dónde encaja en el mapa mental (consulte la sangría enumerada arriba)\n" +
        "4. ¿Cuáles son algunas cosas a considerar al agregar nodos secundarios, hermanos y principales a su alrededor en el mapa mental?\n" +
        "5. ¿Cuáles son algunas buenas preguntas para hacerle a ChatGPT para comprender mejor este nodo?\n" +
        "6. Y, por último, sólo algunas ideas creativas novedosas en las que pensar en relación con este nodo.\n" +
        "Al abordar estos puntos, recuerde que estamos hablando de la ${text_of_node}' nodo dentro del contexto del mapa mental con guiones en una lista arriba."
    );

    document.getElementById("child-node-suggestion").value = getValueOrDefault(
      options,
      "child-node-suggestion",
      "Estoy creando un mapa de afinidad. Esto es lo que está visible actualmente\n" +
        "${hyphenated_list}\n" +
        "Necesito algunos conceptos claves para agregar al menos dos nodos secundarios a '${text_of_node}', haciendo uso del framework lean Startup \n" +
        "Proporcione una lista de conceptos, en el mismo formato con guiones anterior, que serían los nodos hijos ideales de '${text_of_node}', sin líneas vacías. La lista debe priorizarse por relevancia e importancia.\n" +
        "Coloca los conceptos claves relacionados con el tema central: ${text_of_node}', Cada nodo debe contener una solo una idea o concepto de:  '${text_of_node}' nodo.\n" 
  //       "Ademas de tener en cuenta conceptos o pensaminetos sobre:\n" +
  //       "1. El problema que abarca\n" +
  //       "2. Factores o elementos que contribuyen al problema\n" +
  //       "3. soluciones o enfoques se han considerado previamente para afontar el problema (consulte la sangría enumerada arriba)\n" +
  //       "4. Los objetivos que queremos lograr, agregar nodos secundarios, hermanos y principales a su alrededor en el mapa mental?\n" +
  //       "5. Recursos están disponibles para abordar este problema\n" +
  //       "Al abordar estos puntos, recuerde que estamos hablando de: ${text_of_node}' nodo dentro del contexto del mapa de afinidad con guiones en una lista arriba.\n"+
	// "Debe haber al menos dos conceptos claves para los nodos secundarios inmediatos de '${text_of_node}'.\n"+
	// "Cada sugerencia debe complementar, aumentar y armonizar con el mapa de afinidad mencionado anteriormente siguiendo la metodologia Lean Startup.\n"
    );
    document.getElementById("prefix-prompt").value = getValueOrDefault(
      options,
      "prefix-prompt",
      "Estoy creando un mapa de afinidad. Esto es lo que está visible actualmente en el mapa de afinidad:\n${hyphenated_list}\nI quisiera discutir el'${cur_topic}' nodo.\n\n"
    );

   /* document.getElementById("restructure-prompt").value = getValueOrDefault(
      options,
      "restructure-prompt",
	"I am creating a mindmap, here's what is currently visible in the mindmap:\n${hyphenated_list}\n"+
	"Restructure the mindmap listed above into a more cohesive, clear, and impactful mindmap.\n"+
	    "The restructured mindmap should have many levels, but no less than 3 children and no more than 6 children per item.\n"+
	    "Use the same hyphenated hierarchical format above, with no empty lines.\n"+
	    "Ensure that the hierarchical hyphenated list is surrounded by <embed></embed>.\n"+
	    "Do not include the top level node.\n"
    );*/

    document.getElementById("gpt-engine").value = getValueOrDefault(
      options,
      "gpt-engine",
      "gpt-3.5-turbo"
    );
    document.getElementById("temperature").value = getValueOrDefault(
      options,
      "temperature",
      "0.5"
    );
  }