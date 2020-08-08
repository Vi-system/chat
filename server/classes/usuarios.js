module.exports = class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregar_persona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;
    }

    get_persona(id) {
        let persona = this.personas.filter((p) => p.id === id)[0];

        return persona;
    }

    get_personas() {
        return this.personas;
    }

    get_personas_por_salas(sala) {
        let personas_en_sala = this.personas.filter((p) => p.sala === sala);
        return personas_en_sala;
    }

    borrar_persona(id) {
        let persona_borrada = this.get_persona(id);

        this.personas = this.personas.filter((p) => p.id !== id);

        return persona_borrada;
    }
};
