const urlApi = 'http://localhost:1337/api/pacientes';

// GET - Buscar todos os pacientes
export async function GetPatients() {
    const response = await fetch(urlApi);
    const pacientes = await response.json();
    return pacientes.data;
}

// POST - Cadastrar novo paciente
export async function RegisterPatient(data: any) {
    const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// PUT - Atualizar paciente pelo ID
export async function UpdatePatient(id: string, data: any) {
    const response = await fetch(`${urlApi}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// DELETE - Remover paciente pelo ID
export async function DeletePatient(id: string) {
    const response = await fetch(`${urlApi}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}
