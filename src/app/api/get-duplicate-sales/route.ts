import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const response = await fetch(`${process.env.BOX_LINK_PRODUCTS_ENDPOINT}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const parseDate = (dateString) => {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const referenceDate = parseDate("20/12/2024 11:57:45");
    const endDate = parseDate("27/12/2024 12:59:59");

    // Filter orders within the date range
    const filteredData = data.filter((order) => {
      const orderDate = parseDate(order.created_at);
      return orderDate >= referenceDate && orderDate <= endDate;
    });
    const findDuplicateOrders = (orders) => {
        const nameMap = new Map();
        const duplicates = [];
      
        // Agrupar pedidos por nome
        for (const order of orders) {
          const normalizedNome = order.Nome.trim().toLowerCase(); // Normalizar o nome
          if (!nameMap.has(normalizedNome)) {
            nameMap.set(normalizedNome, []);
          }
          nameMap.get(normalizedNome)?.push(order);
        }
      
        // Identificar nomes com mais de um pedido
        for (const [, ordersWithSameName] of nameMap) {
          if (ordersWithSameName.length > 1) {
            duplicates.push(ordersWithSameName[0]);
          }
        }
      
        return duplicates;
      }

    const duplicated_orders = findDuplicateOrders(filteredData);

    return NextResponse.json({
      message: `${duplicated_orders.length} duplicate orders identified within the date range.`,
      data: duplicated_orders,
    });
  } catch (error) {
    console.error("Error processing duplicates:", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
